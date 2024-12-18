// src/components/comment/commentCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommentCard from './commentCard';
import type { Comment, User, Role } from '@/types';

// Mock the next/link component
jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    );
});

describe('CommentCard', () => {
    const mockUser: User = {
        id: 123,
        username: 'TestUser',
        role: 'USER' as Role,
        isBlocked: false,
    };

    const mockComment: Comment = {
        id: 1,
        body: 'Test comment body',
        author: mockUser,
        createdAt: Date.now(),
        reviewId: 789
    };

    const mockOnDelete = jest.fn();

    it('renders comment body and author username', () => {
        render(
            <CommentCard
                comment={mockComment}
                reviewAuthorId={456}
                userId={789}
            />
        );

        expect(screen.getByText('Test comment body')).toBeInTheDocument();
        expect(screen.getByText('TestUser')).toBeInTheDocument();
    });

    it('renders date correctly', () => {
        render(
            <CommentCard
                comment={mockComment}
                reviewAuthorId={456}
                userId={789}
            />
        );

        const formattedDate = new Date(mockComment.createdAt).toLocaleDateString();
        expect(screen.getByText(formattedDate)).toBeInTheDocument();
    });

    it('shows author indicator when comment is from review author', () => {
        render(
            <CommentCard
                comment={mockComment}
                reviewAuthorId={123} // Same as comment author ID
                userId={789}
            />
        );

        expect(screen.getByText('• author')).toBeInTheDocument();
    });

    it('shows delete icon and handles click when onDelete is provided', () => {
        render(
            <CommentCard
                comment={mockComment}
                onDelete={mockOnDelete}
                reviewAuthorId={456}
                userId={789}
            />
        );

        const deleteIcon = screen.getByText('', {
            selector: 'svg path[d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12z"]'
        }).parentElement;

        fireEvent.click(deleteIcon!);

        expect(mockOnDelete).toHaveBeenCalledWith(mockComment.id);
    });

    it('does not show delete button when onDelete is not provided', () => {
        render(
            <CommentCard
                comment={mockComment}
                reviewAuthorId={456}
                userId={789}
            />
        );

        const deleteButton = screen.queryByRole('button');
        expect(deleteButton).not.toBeInTheDocument();
    });

    it('applies correct styling when user is comment author', () => {
        render(
            <CommentCard
                comment={mockComment}
                reviewAuthorId={456}
                userId={123} // Same as comment author ID
            />
        );

        const username = screen.getByText('TestUser');
        expect(username).toHaveClass('text-green-500');
    });
});