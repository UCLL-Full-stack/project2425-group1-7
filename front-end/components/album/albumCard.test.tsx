import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlbumCard from './albumCard';
import { useRouter } from 'next/router';
import { Album } from '@/types';

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeInTheDocument(): R;
            toHaveClass(...classNames: string[]): R;
        }
    }
}

jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));

describe('AlbumCard', () => {
    const mockPush = jest.fn();
    const mockUseRouter = useRouter as jest.Mock;

    beforeEach(() => {
        mockUseRouter.mockImplementation(() => ({
            push: mockPush
        }));
        jest.clearAllMocks();
    });

    const mockAlbum: Album = {
        id: '123',
        name: 'Test Album',
        artist: 'Test Artist',
        image: [
            { '#text': 'small.jpg', size: 'small' },
            { '#text': 'medium.jpg', size: 'medium' },
            { '#text': 'large.jpg', size: 'large' },
            { '#text': 'extralarge.jpg', size: 'extralarge' }
        ]
    };

    it('renders album information correctly', () => {
        render(<AlbumCard album={mockAlbum} />);

        expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();

    const image = screen.getByAltText('Test Album cover') as HTMLImageElement;
expect(image).toBeInTheDocument();
expect(image.src).toContain('extralarge.jpg');
    });

    it('uses fallback image URL when album image is not available', () => {
        const albumWithoutImage: Album = {
            ...mockAlbum,
            image: []
        };

        render(<AlbumCard album={albumWithoutImage} />);

        const image = screen.getByAltText('Test Album cover') as HTMLImageElement;
        expect(image.src).toContain('https://fakeimg.pl/600x400?text=Test%20Album');
    });

        it('navigates to album detail page when clicked', () => {
            render(<AlbumCard album={mockAlbum} />);

            const card = screen.getByText('Test Album').closest('div');
            fireEvent.click(card!);

            expect(mockPush).toHaveBeenCalledWith('/album/123');
        });

        it('applies hover styles correctly', () => {
            render(<AlbumCard album={mockAlbum} />);

            const card = screen.getByText('Test Album').closest('div');
            expect(card).toHaveClass('grid', 'pl-4', 'text-center', 'sm:pl-2', 'sm:text-left', 'md:pl-0', 'md:text-center');
        });

        it('renders with responsive layout classes', () => {
            render(<AlbumCard album={mockAlbum} />);

            const card = screen.getByText('Test Album').closest('div');
            expect(card).toHaveClass('grid', 'pl-4', 'text-center', 'sm:pl-2', 'sm:text-left', 'md:pl-0', 'md:text-center')
        });
});
