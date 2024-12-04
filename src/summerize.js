const initSummarizationSession = async (type, length) => {
  const summarizationApiAvailable = self.ai.summarizer;
  if (!summarizationApiAvailable) {
    throw new Error('Summarization API is not available.');
  }
  const capabilities = await ai.summarizer.capabilities();
  if (!capabilities || capabilities.available === 'no') {
    throw new Error('Summarization is not supported on this device.');
  }
  const session = await window.ai.summarizer.create({
    type: type,
    format: 'markdown',
    length: length,
  });
  if (capabilities.available === 'after-download') {
    return { session, status: 'Downloading' };
  }
  return { session, status: 'Ready' };
};

export const getSummary = async (text, type, length) => {
  if (!type || type === 'Select Type') {
    type = 'key-points';
  }
  if (!length || length === 'Select Length') {
    length = 'long';
  }
  const { session, status } = await initSummarizationSession(type, length);
  if (status === 'Downloading') {
    return 'Model is currently downloading.';
  }
  const summary = await session.summarize(text);
  session.destroy();
  return summary;
};
