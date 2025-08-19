import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './NotesApplet.css';
import { getMessages, saveMessage, delMessage, getCategory, saveCategory } from '../services/apiService'; //Custom axios API service to save/load notes.

const NoteApp = () => {
  // Variables for notes, categories, search, and filter
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ 
    id: null, 
    title: '', 
    content: '', 
    category: 'Activities' 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState(['Activities', 'Food', 'Hotels', 'Transportation']);
  const [filterCategory, setFilterCategory] = useState('All');
  const [isPreview, setIsPreview] = useState(false);



  // Load notes and categories from backend on initial render
  useEffect(() => {
    document.body.classList.add('notes-body');
    
    // Fetch notes from backend
    const fetchNotes = async () => {
      try {
          const savedNotes = await getMessages({ username: 'testuser', password: 'password' });
          setNotes(savedNotes);
      } catch (error) {
          console.error('Failed to fetch messages', error);
      }
    };
    fetchNotes();
    
    const fetchCategories = async () => {
      try {
          const savedCategories = await getCategory({ username: 'testuser', password: 'password' });
          setCategories(savedCategories);
      } catch (error) {
          console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();

  }, []);

  
  // Create a new note or update existing one
  const saveNote = async () => {
    if (!currentNote.title.trim() && !currentNote.content.trim()) return;
    
    const savedNote = await saveMessage(currentNote, { username: 'testuser', password: 'password' });
    
    if (currentNote.id) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === currentNote.id ? currentNote : note
      ));
    } else {
      setNotes([savedNote, ...notes]);
    }
    
    // Reset current note
    setCurrentNote({ id: null, title: '', content: '', category: 'Activities' });
    setIsPreview(false);
  };

  // Delete a note
  const deleteNote = (id) => {
    try{
        delMessage(id, { username: 'testuser', password: 'password' });
        // Remove note from state
        setNotes(notes.filter(note => note.id !== id));
    }
    catch (error) {
        console.error('Failed to delete message', error);
    }
    
  };

  // Edit a note (load it into the form)
  const editNote = (note) => {
    setCurrentNote(note);
    setIsPreview(false);
  };

  // Add a new category
  const addCategory = async () => {
    const newCategory = prompt('Enter a new category name:');
    if (newCategory && !categories.includes(newCategory)) {

      const savedCategory = await saveCategory(newCategory, { username: 'testuser', password: 'password' });

      setCategories([...categories, savedCategory]);
    }
  };

  // Filter notes based on search term and selected category
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || note.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Toggle between edit and preview modes
  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  return (
    <div className="container">
      <h1 className="main-header">Notebook</h1>
      
      {/* Note Form */}
      <div className="child-container">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Note Title"
            className="w-full p-2 mb-4 border rounded h-64 font-mono"
            value={currentNote.title}
            onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
          />
          
          <div className="flex mb-2">
            <select
              className="p-2 border rounded mr-2"
              value={currentNote.category}
              onChange={(e) => setCurrentNote({...currentNote, category: e.target.value})}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button 
              onClick={addCategory}
              className="bg-gray-200 px-2 py-1 rounded text-sm"
            >
              + New Category
            </button>
            
            <button 
              onClick={togglePreview}
              className="bg-gray-200 px-2 py-1 rounded text-sm ml-auto"
            >
              {isPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>
        
        {isPreview ? (
          <div className="subbody-text">
            <ReactMarkdown>{currentNote.content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            placeholder="Note Content (Supports Markdown)"
            className="w-full p-2 mb-4 border rounded h-64 font-mono"
            value={currentNote.content}
            onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
          />
        )}
        
        <div className="flex justify-between">
          <button 
            onClick={saveNote}
            className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
          >
            {currentNote.id ? 'Update Note' : 'Add Note'}
          </button>
          {currentNote.id && (
            <button 
              onClick={() => {
                setCurrentNote({ id: null, title: '', content: '', category: 'Activities' });
                setIsPreview(false);
              }}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Markdown Help */}
        <div className="markdowntips-text">
          <h3 className="font-bold mb-2">Markdown Tips:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li><code># Heading 1</code> for main headings</li>
            <li><code>## Heading 2</code> for subheadings</li>
            <li><code>**bold**</code> for <strong>bold text</strong></li>
            <li><code>*italic*</code> for <em>italic text</em></li>
            <li><code>- item</code> for bullet lists</li>
            <li><code>1. item</code> for numbered lists</li>
            <li><code>[link text](url)</code> for links</li>
            <li><code>![alt text](image-url)</code> for images</li>
            <li><code>```code```</code> for code blocks</li>
          </ul>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="child-container">
        <input
          type="text"
          placeholder="Search notes..."
          className="p-2 border rounded flex-grow mr-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      {/* Notes List */}
      <div className='child-container'>
        <h2 className="body-text">Your Notes ({filteredNotes.length})</h2>
        {filteredNotes.length === 0 ? (
          <p className="subbody-text">No notes found. Create your first note!</p>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map(note => (
              <div key={note.id} className="subbody-text">
                <div className="subbody-text">
                  <div>
                    <h3>{note.title}</h3>
                    <span className='category-text'>{note.category}</span>
                  </div>    
                </div>
                <div className="prose max-w-none mt-2">
                  <ReactMarkdown>{note.content}</ReactMarkdown>
                </div>
                <p className="small-text">{note.createdAt}</p>
                <div className="space-x-2">
                    <button 
                      onClick={() => editNote(note)}
                      className="EditDelButtons"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteNote(note.id)}
                      className="EditDelButtons"
                    >
                      Delete
                    </button>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
    </div>
  );
};

export default NoteApp;