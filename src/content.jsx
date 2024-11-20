import ReactDOM from 'react-dom/client';
import AiOverlayIcon from './components/AiOverlayIcon';
import AiOptions from './components/AiOptions';
import TextAdjustComponent from './components/Summerise';
import Translate from './components/Translate';
import ChatInterface from './components/ChatInterface';
import AiSmartTable from './components/AiSmartTable';
// import RewriteComponent from './components/Rewrite';  // Example component
// import AnalyzeComponent from './components/Analyze';  // Example component

import './index.css';

let aiIconContainer = null;
let aiOptionsContainer = null;
let floatingComponentContainer = null;
let bottomRightX = null;
let bottomRightY = null;
let selectedText = "";

const insertAiIcon = (mouseX, mouseY) => {
  if (!aiIconContainer) {
    aiIconContainer = document.createElement('div');
    aiIconContainer.id = 'floatingButton';
    aiIconContainer.style.position = 'absolute';
    aiIconContainer.style.pointerEvents = 'auto';
    aiIconContainer.style.zIndex = '1000';
    aiIconContainer.style.display = 'block';
    document.body.appendChild(aiIconContainer);

    const root = ReactDOM.createRoot(aiIconContainer);
    root.render(<AiOverlayIcon onClick={addIconOptions} />);
  }

  aiIconContainer.style.left = `${mouseX}px`;
  aiIconContainer.style.top = `${mouseY}px`;
}

const addIconOptions = () => {
  if (!aiOptionsContainer) {
    aiOptionsContainer = document.createElement('div');
    aiOptionsContainer.id = 'floatingOptions';
    aiOptionsContainer.style.position = 'absolute';
    aiOptionsContainer.style.pointerEvents = 'auto';
    aiOptionsContainer.style.zIndex = '1000';
    aiOptionsContainer.style.display = 'block';
    aiOptionsContainer.style.left = `${bottomRightX}px`;
    aiOptionsContainer.style.top = `${bottomRightY}px`;
    document.body.appendChild(aiOptionsContainer);

    const root = ReactDOM.createRoot(aiOptionsContainer);
    root.render(<AiOptions onOptionSelect={handleOptionSelect} />);
  }
}
const removeFloatingComponentContainer = () => {
  if (floatingComponentContainer) {
    floatingComponentContainer.remove();
    floatingComponentContainer = null;
  }
}

const handleOptionSelect = (option) => {
  if (!floatingComponentContainer) {
    floatingComponentContainer = document.createElement('div');
    floatingComponentContainer.id = 'floatingComponentContainer';
    floatingComponentContainer.style.position = 'absolute';
    floatingComponentContainer.style.pointerEvents = 'auto';
    floatingComponentContainer.style.zIndex = '1001';
    document.body.appendChild(floatingComponentContainer);
  }

  floatingComponentContainer.style.left = `${bottomRightX}px`;
  floatingComponentContainer.style.top = `${bottomRightY + 40}px`;

  const root = ReactDOM.createRoot(floatingComponentContainer);

  // Conditionally render component based on option
  switch (option) {
    case 'summarize':
      console.log('Summarizing text:', selectedText);
      root.render(<TextAdjustComponent text={selectedText} clear={removeFloatingComponentContainer} />);
      break;
    case 'translate':
      root.render(<Translate initialText={selectedText} clear={removeFloatingComponentContainer} />);
      break;
    case 'analyze':
      root.render(<ChatInterface />);
      break;
    case 'ai_table':
      root.render(<AiSmartTable initialText={selectedText} clear={removeFloatingComponentContainer} />);
      break;
    default:
      root.unmount();
  }
}

const handleSelectionChange = () => {
  const selection = window.getSelection();

  if (!selection.toString().trim()) {
    if (aiIconContainer) {
      aiIconContainer.remove();
      aiIconContainer = null;
    }
    if (aiOptionsContainer) {
      setTimeout(() => {
        aiOptionsContainer.remove();
        aiOptionsContainer = null;
      }, 150);
    }
  } else if (selection.rangeCount > 0) {
    selectedText = selection.toString().trim();
    const range = selection.getRangeAt(0);
    const clientRects = range.getClientRects();

    if (clientRects.length > 0) {
      const lastRect = clientRects[clientRects.length - 1];
      bottomRightX = lastRect.right + window.scrollX; 
      bottomRightY = lastRect.bottom + window.scrollY; 
      insertAiIcon(bottomRightX - 50, bottomRightY + 10);
    }
  }
}

document.addEventListener('selectionchange', handleSelectionChange);



// // Event listener for mouseup
// document.addEventListener('mouseup', (event) => {
//   lastMouseX = event.clientX + window.scrollX;
//   lastMouseY = event.clientY + window.scrollY;

//   if (window.getSelection().toString().trim()) {
//     console.log("Selection confirmed on mouseup.");
//     addFloatingButton(lastMouseX, lastMouseY, "mouseup");
//   } else {
//     console.log("Mouseup detected without valid selection.");
//   }
// });
