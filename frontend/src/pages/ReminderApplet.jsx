import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const ReminderApp = () => {
  // State for reminders and current reminder being edited
    const [reminders, setReminders] = useState([]);
    const [currentReminder, setCurrentReminder] = useState({ 
      id: null, 
      title: '', 
      content: '', 
      category: 'Urgent' 
    });
  const [categories, setCategories] = useState(['Urgent', 'Today', 'Tomorrow']);
  const [filterCategory, setFilterCategory] = useState('All');
  const [isPreview, setIsPreview] = useState(false);

  // Load reminders from localStorage on initial render
  useEffect(() => {
    const savedReminders = localStorage.getItem('reminders');
    const savedCategories = localStorage.getItem('categories');
    
    if (savedReminders) {
      setRminders(JSON.parse(savedReminders));
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Save reminders and categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);
  
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Create a new reminder or update existing one
  const saveReminder = () => {
    if (!currentReminder.title.trim() && !currentReminder.content.trim()) return;
    
    if (currentReminder.id) {
      // Update existing reminder
      setReminders(reminders.map(reminder => 
        reminder.id === currentReminder.id ? currentReminder : reminder
      ));
    } else {
      // Create new reminder
      const newReminder = {
        ...currentReminder,
        id: Date.now(),
        createdAt: new Date().toLocaleString()
      };
      setReminders([newReminder, ...reminders]);
    }
    
    // Reset current reminder
    setcurrentReminder({ id: null, title: '', content: '', category: 'Activities' });
    setIsPreview(false);
  };

  // Delete a reminder
  const deleteReminder = (id) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  // Edit a reminder (load it into the form)
  const editReminder = (reminder) => {
    setcurrentReminder(reminder);
    setIsPreview(false);
  };

  // Add a new category
  const addCategory = () => {
    const newCategory = prompt('Enter a new category name:');
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  // Filter reminders based on search term and selected category
  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          reminder.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || reminder.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Toggle between edit and preview modes
  const togglePreview = () => {
    setIsPreview(!isPreview);
  };




return(
    <div class="container">
    <h1 class="main-header">Reminder</h1>
    <form id="mainForm">
    <div class="input-group">
        <label for="title" class="label-title">Enter Title</label>
        <input type="text" id="title" required/>
    </div>
    <div class="input-group">
        <label for="description" class="label-title">Enter Description</label>
        <textarea id="description" required></textarea>
    </div>

    <button type="submit">Add Reminder</button>
    <button type="reset">Clear Input Fields</button>
    </form>

    <div class="table">
    <div class="table-header">
        <h3>Reminder Title</h3>
        <h3>Reminder Description</h3>
        <h3>Status</h3>
    </div>
    </div>
    </div>
  );
};

export default ReminderApp;