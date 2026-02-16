import { useState, useEffect } from "react";
import "./DecisionTree.scss";

function boldBeforeEquals(paragraph) {
  return paragraph
    .split("\n")
    .map((line) => {
      const idx = line.indexOf(":");
      if (idx !== -1) {
        const before = line.slice(0, idx).trim();
        const after = line.slice(idx);
        return `<b>${before}</b>${after}`;
      }
      return line;
    })
    .join("<br/>");
}

/**
 * DecisionTree Component
 * Visualizes a hierarchical decision tree structure
 *
 * @param {Object} props
 * @param {Object} props.data - Tree node object with structure: { label, children: [] }
 * @param {Function} props.onProductClick - Callback when a product node is clicked
 * @param {Boolean} props.resetTrigger - Trigger to reset all expanded nodes
 * @param {Function} props.onReset - Callback when start over button is clicked
 */
function DecisionTree({ data, onProductClick, resetTrigger, onReset }) {
  const [currentNode, setCurrentNode] = useState(data);
  const [navigationPath, setNavigationPath] = useState([]);

  useEffect(() => {
    // Reset to root on resetTrigger change
    setCurrentNode(data);
    setNavigationPath([]);
  }, [resetTrigger, data]);

  const handleNodeClick = (node) => {
    const isProduct = !node.children || node.children.length === 0;
    if (isProduct && onProductClick) {
      onProductClick(node);
    } else if (!isProduct) {
      // Navigate into this node
      setNavigationPath([...navigationPath, currentNode]);
      setCurrentNode(node);
    }
  };

  const handleBackClick = () => {
    if (navigationPath.length > 0) {
      const newPath = [...navigationPath];
      const previousNode = newPath.pop();
      setCurrentNode(previousNode);
      setNavigationPath(newPath);
    }
  };

  const TreeNode = ({ node }) => {
    const isProduct = !node.children || node.children.length === 0;
    // If it's a product, only show if url is non-empty (not null, undefined, or empty string)
    if (isProduct && (!node.url || node.url.trim() === "")) {
      return null;
    }
    // If it's a category, and all children are products with empty url, hide this category
    if (
      !isProduct &&
      node.children &&
      node.children.length > 0 &&
      node.children.every(
        (child) =>
          (!child.children || child.children.length === 0) &&
          (!child.url || child.url.trim() === ""),
      )
    ) {
      return null;
    }
    return (
      <div
        className={`node-label ${isProduct ? "product" : "category"}`}
        onClick={() => handleNodeClick(node)}
      >
        {node.label}
      </div>
    );
  };

  const handleStartOver = () => {
    onReset();
  };

  // Recursively filter out categories whose descendants are all products with empty url
  function hasVisibleDescendant(node) {
    const isProduct = !node.children || node.children.length === 0;
    if (isProduct) {
      return !!(node.url && node.url.trim() !== "");
    }
    if (!node.children || node.children.length === 0) {
      return false;
    }
    return node.children.some(hasVisibleDescendant);
  }

  const filteredChildren = currentNode.children
    ? currentNode.children.filter(hasVisibleDescendant)
    : [];

  return (
    <>
      {currentNode.headline && <h2>{currentNode.headline}</h2>}
      <div className="decision-tree">
        <div className="children">
          {filteredChildren.map((child, index) => (
            <TreeNode key={index} node={child} />
          ))}
        </div>
        <div className="navigation-buttons">
          {navigationPath.length > 0 && (
            <button onClick={handleBackClick} className="navigation-btn">
              ← Back
            </button>
          )}
          {navigationPath.length > 0 && (
            <button onClick={handleStartOver} className="navigation-btn">
              Start Over
            </button>
          )}
        </div>
      </div>
      {currentNode.description && (
        <p>
          {currentNode.description.split("\n").map((line, idx) => {
            const idxColon = line.indexOf(":");
            if (idxColon !== -1) {
              const before = line.slice(0, idxColon).trim();
              const after = line.slice(idxColon);
              return (
                <span key={idx}>
                  <b>{before}</b>
                  {after}
                  <br />
                </span>
              );
            }
            return (
              <span key={idx}>
                {line}
                <br />
              </span>
            );
          })}
        </p>
      )}
    </>
  );
}

export default DecisionTree;
