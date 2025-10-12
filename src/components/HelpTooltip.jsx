import React, { useState } from 'react';

const HelpTooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="help-tooltip-container">
      {children}
      <div 
        className={`help-tooltip ${isVisible ? 'visible' : ''}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <span className="help-icon">?</span>
        <div className="help-content">
          {content}
        </div>
      </div>
    </div>
  );
};

export default HelpTooltip;



