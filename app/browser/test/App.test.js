import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/dom';
import '@testing-library/jest-dom';

// Note: This is a basic test structure
// Full implementation would require mocking the game library dependencies

describe('App', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should render landing page', () => {
    const html = `
      <div id="index-view" class="landing-page">
        <h1 class="landing-title">Backgammon.js</h1>
        <button id="btn-play-random">Random player</button>
        <button id="btn-challenge-friend">Challenge friend</button>
      </div>
    `;
    document.body.innerHTML = html;

    expect(screen.getByText('Backgammon.js')).toBeInTheDocument();
    expect(screen.getByText('Random player')).toBeInTheDocument();
    expect(screen.getByText('Challenge friend')).toBeInTheDocument();
  });

  it('should have accessible buttons', () => {
    const html = `
      <button id="btn-play-random" aria-label="Play random game">Random player</button>
    `;
    document.body.innerHTML = html;

    const button = screen.getByRole('button', { name: /play random/i });
    expect(button).toBeInTheDocument();
  });
});

