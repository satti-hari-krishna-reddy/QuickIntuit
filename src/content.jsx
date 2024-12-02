import ReactDOM from 'react-dom/client';
import AiOverlayIcon from './components/AiOverlayIcon';
import AiOptions from './components/AiOptions';
import TextAdjustComponent from './components/Summerise';
import Translate from './components/Translate';
import ChatInterface from './components/ChatInterface';
import AiSmartTable from './components/AiSmartTable';
import Write from './components/WriteX';  
import ReWrite from './components/Rewrite';
import WriteRight from './components/WriteRight';

let aiIconContainer = null;
let aiOptionsContainer = null;
let floatingComponentContainer = null;
let bottomRightX = null;
let bottomRightY = null;
let selectedText = "";

let copiedText = '';
let selectedRange = null; 
let activeElement = null; 

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

  if (document.body.contains(aiIconContainer)) {
    aiIconContainer.style.left = `${mouseX}px`;
    aiIconContainer.style.top = `${mouseY}px`;


    if (!aiIconContainer.hasListener) {
      aiIconContainer.addEventListener('mousedown', (event) => {
        event.preventDefault(); // Prevent default browser behavior
        event.stopPropagation(); // Stop Gmail's scripts from hijacking
      });

      aiIconContainer.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent Gmail's scripts from hijacking the click
        event.preventDefault(); 
      });

      aiIconContainer.hasListener = true; // Custom property to track listener
    }
  } else {
    console.warn("aiIconContainer was removed. Re-injecting.");
    aiIconContainer = null; // Reset and try again
    insertAiIcon(mouseX, mouseY);
  }
};

const addIconOptions = () => {
  if (!aiOptionsContainer) {
    aiOptionsContainer = document.createElement('div');
    aiOptionsContainer.id = 'floatingOptions';
    aiOptionsContainer.style.position = 'absolute';
    aiOptionsContainer.style.pointerEvents = 'auto';
    aiOptionsContainer.style.zIndex = '1000';
    aiOptionsContainer.style.display = 'block';
    aiOptionsContainer.style.left = `${bottomRightX}px`;
    aiOptionsContainer.style.top = `${bottomRightY - 50}px`;
    document.body.appendChild(aiOptionsContainer);

    const shadowRoot = aiOptionsContainer.attachShadow({ mode: 'open' });

    const root = ReactDOM.createRoot(shadowRoot);
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

  floatingComponentContainer.style.left = `${bottomRightX - 40 }px`;
  floatingComponentContainer.style.top = `${bottomRightY - 80}px`;

  const root = ReactDOM.createRoot(floatingComponentContainer);

  // Conditionally render component based on option
  switch (option) {
    case 'summarize':
      root.render(<TextAdjustComponent text={selectedText} clear={removeFloatingComponentContainer} />);
      break;
    case 'translate':
      root.render(<Translate initialText={selectedText} clear={removeFloatingComponentContainer} />);
      break;
    case 'ask_ai':
      root.render(<ChatInterface text={selectedText} clear={removeFloatingComponentContainer}/>);
      break;
    case 'ai_table':
      root.render(<AiSmartTable initialText={selectedText} clear={removeFloatingComponentContainer} />);
      break;
    case 'write':
      root.render(<Write clear={removeFloatingComponentContainer} />);
      break;
    case 'rewrite':
      root.render(<ReWrite text={selectedText} clear={removeFloatingComponentContainer} replaceText={replaceSelectedText} />);
      break;
    case 'write_better':
      root.render(<WriteRight initialText={selectedText} clear={removeFloatingComponentContainer} replaceText={replaceSelectedText} />);
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
        console.log('Removing options container');
        aiOptionsContainer.remove();
        aiOptionsContainer = null;
      }, 150);
    }
  } else if (selection.rangeCount > 0) {
    selectedText = selection.toString().trim();
    const range = selection.getRangeAt(0);
    const clientRects = range.getClientRects();

    copiedText = selection.toString().trim();
    selectedRange = selection.getRangeAt(0); 
    activeElement = document.activeElement; 

    if (clientRects.length > 0) {
      const lastRect = clientRects[clientRects.length - 1];
      bottomRightX = lastRect.right + window.scrollX; 
      bottomRightY = lastRect.bottom + window.scrollY; 
      insertAiIcon(bottomRightX - 50, bottomRightY + 10);
    }
  }
}

document.addEventListener('selectionchange', handleSelectionChange);


const replaceSelectedText = (newText) => {
  if (!selectedRange || !copiedText) return; 

  if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
    const start = activeElement.selectionStart;
    const end = activeElement.selectionEnd;
    activeElement.value = activeElement.value.slice(0, start) + newText + activeElement.value.slice(end);
    activeElement.selectionStart = activeElement.selectionEnd = start + newText.length;

  } else {

    try {
      const range = selectedRange;
      const newTextNode = document.createTextNode(newText); 

     
      range.deleteContents();
      range.insertNode(newTextNode);

      const selection = window.getSelection();
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.setStart(newTextNode, 0);
      newRange.setEnd(newTextNode, newText.length);
      selection.addRange(newRange);

    } catch (error) {
      console.error('Error replacing text in regular element:', error);
    }
  }
};