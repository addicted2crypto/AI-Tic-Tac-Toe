import React from 'react'
import  { useState } from 'react';

const ModelOptions = () => {
  const [selectedModel, setSelectedModel] = useState('');
  const models = [
    { label: 'xAI Grok', value: 'xai-grok-3-beta' },
    { label: 'OpenAI GPT-4', value: 'openai-gpt-4' },
    { label: 'Anthropic Claude', value: 'anthropic-claude' },
    { label: 'Local llama3.3b', value: 'local-llama3.3b' }, 
    { label: 'Local llama3.1b', value: 'local-llama3.1b' },
    { label: 'Local llama2b', value: 'local-llama2b' },
    { label: 'Local gpt-oss:20b', value: 'local-gpt-oss:20b' }, 
    { label: 'Local gpt-oss:12b', value: 'local-gpt-oss:12b' },
    // Will add more models here...
  ];
    //will get rid of any this is not the way to do it, just testing
  const handleModelChange = (event: any) => {
    setSelectedModel(event.target.value);
  };

  return (
    <div className="p-0.75 bg-[#00000]">
      <select value={selectedModel} onChange={handleModelChange}>
        {models.map((model, index) => (
          <option key={index} value={model.value}>
            {model.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelOptions;
