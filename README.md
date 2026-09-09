# TRACE — Lost & Found

TRACE is a full-stack Lost & Found web application that helps users report, browse, and find lost or found items.

## About the Project

TRACE provides a simple platform where users can report lost or found items by providing details such as the item name, category, location, description, contact information, and an image.

Users can browse the available items, view individual item details, and contact the person who reported the item.

This project was developed as part of a Full-Stack Web Development workshop conducted by my college.

## Features

- Report lost or found items
- Upload images of items
- Browse lost and found items
- View detailed information about an item
- Search and explore available items
- Contact the item owner
- Share item details
- Form validation
- Responsive user interface

## Technologies Used

- React.js
- Vite
- JavaScript
- Tailwind CSS
- Supabase
- Supabase Storage
- React Router
- Vercel

## Application Flow

1. User visits the TRACE application.
2. User can browse lost and found items.
3. User can report a lost or found item.
4. Item details and images are stored using Supabase.
5. Users can open an item to view its complete details.
6. Users can contact the item owner.
7. Item links can be shared with others.

## Database

Supabase is used as the backend database.

The `lostandfound` table stores information such as:

- Product ID
- Product Name
- Contact Number
- Image URL
- Status
- Category
- Location
- Description

Supabase Storage is used for storing uploaded item images.

## Installation

### Clone the repository

```bash
git clone https://github.com/shreenidhi0308-png/lostandfound.git
