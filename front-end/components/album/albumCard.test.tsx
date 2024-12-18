import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlbumCard from './albumCard';
import type { Album } from '@/types';

const mockAlbum: Album = {
    id: 'Test Album-Test Artist',
    name: 'Test Album',
    artist: 'Test Artist',
    image: [
        { '#text': 'small-image.jpg', size: 'small' },
        { '#text': 'medium-image.jpg', size: 'medium' },
        { '#text': 'large-image.jpg', size: 'large' },
        { '#text': 'extralarge-image.jpg', size: 'extralarge' },
        { '#text': 'mega-image.jpg', size: 'mega' }
    ]
};

describe('AlbumCard', () => {
    it('renders album name and artist', () => {
        render(<AlbumCard album={mockAlbum} />);

        expect(screen.getByText('Test Album')).toBeInTheDocument();
        expect(screen.getByText('Test Artist')).toBeInTheDocument();
    });

    it('renders album cover image with correct alt text', () => {
        render(<AlbumCard album={mockAlbum} />);

        const image = screen.getByAltText('Test Album cover') as HTMLImageElement;
        expect(image).toBeInTheDocument();
        expect(image.src).toContain('mega-image.jpg');
    });

    it('handles missing image gracefully', () => {
        const albumWithoutImage: Album = {
            ...mockAlbum,
            image: []
        };

        render(<AlbumCard album={albumWithoutImage} />);

        const image = screen.getByAltText('Test Album cover') as HTMLImageElement;
        expect(image).toBeInTheDocument();
        expect(image.getAttribute('src')).toBe('');  // Changed this line
    });
});