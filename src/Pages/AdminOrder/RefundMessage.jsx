import React from 'react';

const RefundMessage = ({ message }) => message ? <div className="alert alert-info">{message}</div> : null;

export default RefundMessage;