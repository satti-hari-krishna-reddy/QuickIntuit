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
import VoiceAssistant from './components/VoiceChat';

let aiIconContainer = null;
let aiOptionsContainer = null;
let floatingComponentContainer = null;
let bottomRightX = null;
let bottomRightY = null;
let selectedText = '';

let selectedRange = null;
let activeElement = null;

// let viewportWidth = window.innerWidth;
// let viewportHeight = window.innerHeight;

// const insertAiIcon = (mouseX, mouseY) => {
//   if (!aiIconContainer) {
//     aiIconContainer = document.createElement('div');
//     aiIconContainer.id = 'floatingButton';
//     aiIconContainer.style.position = 'absolute';
//     aiIconContainer.style.pointerEvents = 'auto';
//     aiIconContainer.style.zIndex = '1000';
//     aiIconContainer.style.display = 'block';

//     document.body.appendChild(aiIconContainer);

//     const root = ReactDOM.createRoot(aiIconContainer);
//     root.render(<AiOverlayIcon onClick={addIconOptions} />);
//     console.log('Ai Icon inserted');
//   }

//   if (document.body.contains(aiIconContainer)) {
//     if (mouseX + 50 > viewportWidth) {
//       // mouseX = viewportWidth - 50;
//       mouseX = mouseX - 50;
//       console.log('mosueX', mouseX);
//       console.log('viewportWidth', viewportWidth);
//     }
//     if (mouseY + 50 > viewportHeight) {
//       // mouseY = viewportHeight - 50;
//       mouseY = mouseY - 50;
//       console.log('mosueY', mouseY);
//       console.log('viewportHeight', viewportHeight);
//     }

//     aiIconContainer.style.left = `${mouseX}px`;
//     aiIconContainer.style.top = `${mouseY}px`;
//     console.log('Ai Icon position updated');

//     if (!aiIconContainer.hasListener) {
//       aiIconContainer.addEventListener('mousedown', (event) => {
//         event.preventDefault(); // Prevent default browser behavior
//         event.stopPropagation(); // Stop Gmail's scripts from hijacking
//       });

//       aiIconContainer.addEventListener('click', (event) => {
//         event.stopPropagation(); // Prevent Gmail's scripts from hijacking the click
//         event.preventDefault();
//       });

//       aiIconContainer.hasListener = true; // Custom property to track listener
//     }
//   } else {
//     console.warn('aiIconContainer was removed. Re-injecting.');
//     aiIconContainer = null; // Reset and try again
//     insertAiIcon(mouseX, mouseY);
//   }
// };

let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;

const insertAiIcon = (mouseX, mouseY) => {
  if (!aiIconContainer) {
    aiIconContainer = document.createElement('div');
    aiIconContainer.id = 'floatingButton';
    aiIconContainer.style.position = 'absolute';
    aiIconContainer.style.pointerEvents = 'auto';
    aiIconContainer.style.zIndex = '2147483646';
    aiIconContainer.style.display = 'block';

    document.body.appendChild(aiIconContainer);

    let shadowRoot = aiIconContainer.shadowRoot;
    if (!shadowRoot) {
      shadowRoot = aiIconContainer.attachShadow({ mode: 'closed' });
    }

    const root = ReactDOM.createRoot(shadowRoot);
    root.render(<AiOverlayIcon onClick={addIconOptions} />);
  }

  // Adjust position to keep within bounds
  const iconWidth = 50;
  const iconHeight = 50;

  let adjustedX = mouseX;
  let adjustedY = mouseY;

  if (mouseX + iconWidth > viewportWidth) {
    adjustedX = viewportWidth - iconWidth;
  }

  if (mouseX < 0) {
    adjustedX = 0;
  }

  if (mouseY + iconHeight > viewportHeight + window.scrollY) {
    adjustedY = viewportHeight + window.scrollY - iconHeight;
  }

  if (mouseY < window.scrollY) {
    adjustedY = window.scrollY;
  }

  aiIconContainer.style.left = `${adjustedX}px`;
  aiIconContainer.style.top = `${adjustedY}px`;

  if (!aiIconContainer.hasListener) {
    aiIconContainer.addEventListener('mousedown', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });

    aiIconContainer.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
    });

    aiIconContainer.hasListener = true;
  }
};

// const addIconOptions = () => {
//   if (!aiOptionsContainer) {
//     aiOptionsContainer = document.createElement('div');
//     aiOptionsContainer.id = 'floatingOptions';
//     aiOptionsContainer.style.position = 'absolute';
//     aiOptionsContainer.style.pointerEvents = 'auto';
//     aiOptionsContainer.style.zIndex = '1000';
//     aiOptionsContainer.style.display = 'block';
//     aiOptionsContainer.style.left = `${bottomRightX}px`;
//     aiOptionsContainer.style.top = `${bottomRightY - 50}px`;
//     document.body.appendChild(aiOptionsContainer);

//     const shadowRoot = aiOptionsContainer.attachShadow({ mode: 'closed' });

//     const root = ReactDOM.createRoot(shadowRoot);
//     root.render(<AiOptions onOptionSelect={handleOptionSelect} />);
//   }
// };

const addIconOptions = (mode) => {
  const optionsWidth = 200;
  const optionsHeight = 500;
  const gap = 10;

  if (!aiOptionsContainer) {
    aiOptionsContainer = document.createElement('div');
    aiOptionsContainer.id = 'floatingOptions';
    aiOptionsContainer.style.position = 'absolute';
    aiOptionsContainer.style.pointerEvents = 'auto';
    aiOptionsContainer.style.zIndex = '2147483646';
    aiOptionsContainer.style.display = 'block';

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX =
      bottomRightX != null
        ? bottomRightX + gap
        : (viewportWidth - optionsWidth) / 2;

    let adjustedY =
      bottomRightY != null
        ? bottomRightY - 50
        : window.scrollY + (viewportHeight - optionsHeight) / 2;

    // Prevent going out of bounds
    if (adjustedX + optionsWidth > viewportWidth) {
      adjustedX = viewportWidth - optionsWidth - gap;
    }
    if (adjustedX < 0) {
      adjustedX = 0;
    }
    if (adjustedY + optionsHeight > viewportHeight + window.scrollY) {
      adjustedY = viewportHeight + window.scrollY - optionsHeight - gap;
    }
    if (adjustedY < window.scrollY) {
      adjustedY = window.scrollY + gap;
    }

    if (adjustedX <= bottomRightX && adjustedX + optionsWidth > bottomRightX) {
      adjustedX = bottomRightX + gap;
    }

    aiOptionsContainer.style.left = `${adjustedX}px`;
    aiOptionsContainer.style.top = `${adjustedY}px`;

    document.body.appendChild(aiOptionsContainer);

    let shadowRoot = aiOptionsContainer.shadowRoot;
    if (!shadowRoot) {
      shadowRoot = aiOptionsContainer.attachShadow({ mode: 'closed' });
    }

    const root = ReactDOM.createRoot(shadowRoot);
    root.render(<AiOptions onOptionSelect={handleOptionSelect} mode={mode} />);
  }
};

const removeFloatingComponentContainer = () => {
  if (floatingComponentContainer) {
    floatingComponentContainer.remove();
    floatingComponentContainer = null;
  }
};

const handleOptionSelect = (option) => {
  const componentWidth = 400;
  const componentHeight = 600;
  const gap = 10;

  if (!floatingComponentContainer) {
    floatingComponentContainer = document.createElement('div');
    floatingComponentContainer.id = 'floatingComponentContainer';
    floatingComponentContainer.style.position = 'absolute';
    floatingComponentContainer.style.pointerEvents = 'auto';
    floatingComponentContainer.style.zIndex = '2147483646';
    document.body.appendChild(floatingComponentContainer);
  }

  let adjustedX = bottomRightX - 40;
  let adjustedY = bottomRightY - 80;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight + window.scrollY;

  adjustedX = bottomRightX - componentWidth / 2;

  if (adjustedX + componentWidth > viewportWidth) {
    adjustedX = viewportWidth - componentWidth - gap;
  }

  if (adjustedX < 0) {
    adjustedX = gap;
  }

  if (adjustedY + componentHeight > viewportHeight) {
    adjustedY = viewportHeight - componentHeight - gap;
  }

  if (adjustedY < window.scrollY) {
    adjustedY = window.scrollY + gap;
  }

  floatingComponentContainer.style.left = `${adjustedX}px`;
  floatingComponentContainer.style.top = `${adjustedY}px`;

  let shadowRoot = floatingComponentContainer.shadowRoot;
  if (!shadowRoot) {
    shadowRoot = floatingComponentContainer.attachShadow({ mode: 'closed' });
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  //eslint-disable-next-line no-undef
  link.href = chrome.runtime.getURL('styles.css');
  shadowRoot.appendChild(link);

  const root = ReactDOM.createRoot(shadowRoot);

  // Conditionally render component based on option
  switch (option) {
    case 'summarize':
      root.render(
        <TextAdjustComponent
          text={selectedText}
          clear={removeFloatingComponentContainer}
        />
      );
      break;
    case 'translate':
      root.render(
        <Translate
          initialText={selectedText}
          clear={removeFloatingComponentContainer}
        />
      );
      break;
    case 'ask_ai':
      root.render(
        <ChatInterface
          text={selectedText}
          clear={removeFloatingComponentContainer}
        />
      );
      break;
    case 'ai_table':
      root.render(
        <AiSmartTable
          initialText={selectedText}
          clear={removeFloatingComponentContainer}
        />
      );
      break;
    case 'write':
      root.render(
        <Write
          clear={removeFloatingComponentContainer}
          replaceText={replaceSelectedText}
        />
      );
      break;
    case 'rewrite':
      root.render(
        <ReWrite
          text={selectedText}
          clear={removeFloatingComponentContainer}
          replaceText={replaceSelectedText}
        />
      );
      break;
    case 'write_better':
      root.render(
        <WriteRight
          initialText={selectedText}
          clear={removeFloatingComponentContainer}
          replaceText={replaceSelectedText}
        />
      );
      break;
    case 'voice_chat':
      root.render(
        <VoiceAssistant
          text={selectedText}
          clear={removeFloatingComponentContainer}
        />
      );
      break;
    default:
      root.unmount();
  }
};

// const handleOptionSelect = (option) => {
//   const componentWidth = 400; // Adjust width of the floating component container
//   const componentHeight = 600; // Adjust height of the floating component container
//   const gap = 10; // Optional gap between the icon and the component

//   if (!floatingComponentContainer) {
//     floatingComponentContainer = document.createElement('div');
//     floatingComponentContainer.id = 'floatingComponentContainer';
//     floatingComponentContainer.style.position = 'absolute';
//     floatingComponentContainer.style.pointerEvents = 'auto';
//     floatingComponentContainer.style.zIndex = '1001';
//     document.body.appendChild(floatingComponentContainer);
//   }

//   // Default position (slightly above the icon)
//   let adjustedX = bottomRightX - 40; // Align horizontally with the icon (centered horizontally)
//   let adjustedY = bottomRightY - 80; // Adjust to be above the icon

//   const viewportWidth = window.innerWidth;
//   const viewportHeight = window.innerHeight + window.scrollY;

//   // Adjust X to center the component (align the center of the component with the icon)
//   adjustedX = bottomRightX - componentWidth / 2;

//   // Prevent overflow to the right
//   if (adjustedX + componentWidth > viewportWidth) {
//     adjustedX = viewportWidth - componentWidth - gap; // Move to the left if overflow occurs
//   }

//   // Prevent overflow to the left
//   if (adjustedX < 0) {
//     adjustedX = gap; // Ensure it doesn't go off-screen to the left
//   }

//   // Prevent overflow to the bottom
//   if (adjustedY + componentHeight > viewportHeight) {
//     adjustedY = viewportHeight - componentHeight - gap; // Adjust upwards if it overflows the viewport
//   }

//   // Prevent overflow to the top (if the component is taller than the space above)
//   if (adjustedY < window.scrollY) {
//     adjustedY = window.scrollY + gap; // Adjust downwards if not enough space above
//   }

//   // Apply the calculated positions
//   floatingComponentContainer.style.left = `${adjustedX}px`;
//   floatingComponentContainer.style.top = `${adjustedY}px`;
// };

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

    selectedRange = selection.getRangeAt(0);
    activeElement = document.activeElement;

    if (clientRects.length > 0) {
      const lastRect = clientRects[clientRects.length - 1];
      bottomRightX = lastRect.right + window.scrollX;
      bottomRightY = lastRect.bottom + window.scrollY;
      insertAiIcon(bottomRightX - 63, bottomRightY + 15);
    }
  }
};

document.addEventListener('selectionchange', handleSelectionChange);

const replaceSelectedText = (newText) => {
  if (!selectedRange) return;

  if (
    activeElement &&
    (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')
  ) {
    const start = activeElement.selectionStart;
    const end = activeElement.selectionEnd;
    activeElement.value =
      activeElement.value.slice(0, start) +
      newText +
      activeElement.value.slice(end);
    activeElement.selectionStart = activeElement.selectionEnd =
      start + newText.length;
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

window.addEventListener('resize', () => {
  viewportHeight = window.innerHeight;
  viewportWidth = window.innerWidth;
});

document.addEventListener('keydown', (event) => {
  if (event.altKey && event.key.toLowerCase() === 'q') {
    if (aiIconContainer) {
      aiIconContainer.remove();
      aiIconContainer = null;
    }
    if (aiOptionsContainer) {
      aiOptionsContainer.remove();
      aiOptionsContainer = null;
    }
    removeFloatingComponentContainer();
    addIconOptions('standalone');
  }
});

async function extractTextHybrid(maxTokens) {
  const unwantedSelectors = [
    'nav',
    'footer',
    '.sidebar',
    '.advertisement',
    'header',
    '#ads',
    '.promo',
    'script',
    'style',
  ];

  const isEcommerce = () => {
    const ecommerceIndicators = ['cart', 'product', 'checkout', 'add-to-cart'];
    return ecommerceIndicators.some((keyword) =>
      document.body.innerHTML.toLowerCase().includes(keyword)
    );
  };

  const extractGeneralText = (mainElement) => {
    const elements = Array.from(mainElement.querySelectorAll('*'))
      .filter(
        (el) =>
          !unwantedSelectors.some(
            (selector) => el.matches(selector) || el.closest(selector)
          )
      )
      .map((el) => el.textContent.trim())
      .filter(
        (text) =>
          text.length > 0 &&
          text.split(/\s+/).length > 2 &&
          !text.match(/^(function|var|\(function|\[|{)/)
      );

    return elements.join(' ').replace(/\s+/g, ' ').trim();
  };

  const extractEcommerceText = () => {
    const productSelectors = [
      'h1',
      'h2',
      'p',
      '.price',
      '.offer',
      '.discount',
      '.rating, .stars, .review-score',
      '.review, .user-review, .customer-feedback',
      '.feedback, .comment, .summary',
      '.rating-stars, .rating-number',
    ];

    const elements = Array.from(
      document.querySelectorAll(productSelectors.join(','))
    )
      .map((el) => el.textContent.trim())
      .filter((text) => text.length > 0);

    return elements.join(' ').replace(/\s+/g, ' ').trim();
  };

  // Detect type of website and extract text
  const mainElement =
    document.querySelector('main, article, section') || document.body;
  const rawText = isEcommerce()
    ? extractEcommerceText()
    : extractGeneralText(mainElement);

  // Trim to max tokens (assuming ~4 characters per token)
  const tokenLimit = maxTokens * 4;
  return rawText.slice(0, tokenLimit);
}

function waitForDynamicContent(callback, timeout = 5000) {
  const observer = new MutationObserver((_, obs) => {
    if (document.readyState === 'complete') {
      obs.disconnect();
      callback();
    }
  });
  observer.observe(document, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), timeout);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    waitForDynamicContent(async () => {
      selectedText = await extractTextHybrid(1000);
    });
  });
} else {
  (async () => {
    selectedText = await extractTextHybrid(1000);
  })();
}
