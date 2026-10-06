import React from 'react';
import { createPortal } from 'react-dom';

/**
 * Draws a pop-up on top of the whole page. Inside the page content a pop-up sits underneath the pinned
 * header, which then covers its top edge.
 */
export const ModalPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => createPortal(children, document.body);
