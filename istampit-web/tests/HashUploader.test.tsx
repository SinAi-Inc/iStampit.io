import { render, screen, fireEvent } from '@testing-library/react';
import HashUploader from '../components/HashUploader';
import React from 'react';

describe('HashUploader', () => {
  it('accepts manual hash input', () => {
    let received: string | null = null;
    render(<HashUploader onHash={(h) => (received = h)} />);
    const input = screen.getByPlaceholderText(/e3b0c442/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' } });
    fireEvent.blur(input);
    expect(received).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });
});
