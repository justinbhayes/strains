import "./App.scss";
import DecisionTree from "./DecisionTree";
import { useState } from "react";
import productsDecisionTree from "./productsDecisionTree.json";

function App() {
  const handleStartOver = () => {
    setResetTrigger(!resetTrigger);
  };
  const [resetTrigger, setResetTrigger] = useState(false);

  const handleProductClick = (node) => {
    if (node && node.url) {
      window.open(node.url, "_self");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <a href="https://strainsoftheearth.com/" alt="Strains of the Earth">
          <img
            src="https://b4272112.smushcdn.com/4272112/wp-content/uploads/2025/07/ColorTransitionLogo.gif?lossy=2&strip=1&webp=1"
            className="App-logo"
            alt="Strains of the Earth Logo"
          />
        </a>
        <h1>Let us help you find a product.</h1>
      </header>
      <section className="decision-tree-container">
        <DecisionTree
          data={productsDecisionTree}
          onProductClick={handleProductClick}
          resetTrigger={resetTrigger}
          onReset={handleStartOver}
        />
        <p className="disclaimer">
          This tool is for informational and educational purposes only and is
          designed to help guide your selection based on your preferences and
          general product information. It is not medical advice. Individual
          cannabis experiences may vary. Always use responsibly and consult a
          licensed healthcare professional with health-related questions.
        </p>
      </section>
    </div>
  );
}

export default App;
