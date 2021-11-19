import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./NotesPage.css";
import { postNote, getTheNotes, editNote, deleteNote } from "../../store/note";
import {
    postNotebook,
    getANotebook,
    editNotebook,
    deleteANotebook,
} from "../../store/notebook";

function TheNotes() {
  const dispatch = useDispatch();

  const sessionUser = useSelector((state) => state.session?.user);
  const notes = useSelector((state) => state?.note);
  const notebooks = useSelector((state) => state?.notebook);
  const [newNote, setNewNote] = useState(true);
  const [content, setContent] = useState("");
  const [title, setNewNoteTitle] = useState("");
  const [currentNote, setCurrentNote] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setMainNoteContent] = useState("");
  const [currentNotebook, setCurrentNotebook] = useState("All Notes");
  const [name, setName] = useState("");
  const [newNotebookTitle, setNewNotebookTitle] = useState("");
  const [open, setOpen] = useState(false);








  useEffect(() => dispatch(getTheNotes(sessionUser.id)), []);
  useEffect(() => dispatch(getANotebook(sessionUser.id)), []);
  useEffect(() => {}, [
    currentNote,
    currentContent,
    currentTitle,
    currentNotebook,
    open,
  ]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newNote) {
      const payload = {
        userId: sessionUser.id,
        notebookId: currentNotebook.id,
        content,
        title,
      };
      let createdNote = await dispatch(postNote(payload));
      setCurrentNote(createdNote);
      postNewNote();
      return;
    }
    const editPayload = {
      id: currentNote.id,
      notebookId: currentNotebook.id,
      content: currentContent,
      title: currentTitle,
    };
    await dispatch(editNote(editPayload));
    await dispatch(getTheNotes(sessionUser.id));
  };


  const changeBookName = async (e) => {
    setOpen(!open);
    const editPayload = {
      id: currentNotebook.id,
      name: newNotebookTitle,
    };
    let editedNotebook = await dispatch(editNotebook(editPayload));
    await dispatch(getANotebook(sessionUser.id));
    setCurrentNotebook(editedNotebook);
  };


  const handleNoteDelete = async (e) => {
    e.preventDefault();
    const id = currentNote.id;
    setCurrentNote("");
    await dispatch(deleteNote(id));
    postNewNote();
  };

  const handleBookDelete = async (e) => {
    setOpen(!open);
    await dispatch(deleteANotebook(currentNotebook.id));
    setCurrentNotebook("All Notes");
  };

  const postBook = async (e) => {
    e.preventDefault();
    if (name === "") return;
    const payload = {
      userId: sessionUser.id,
      name,
    };
    await dispatch(postNotebook(payload));
  };

  const setBook = (note) => (
    <li
      className="notebookNavListItem"
      key={note.id}
      onClick={() => {
        setCurrentNote(note);
        setCurrentTitle(note.title);
        setMainNoteContent(note.content);
        setNewNote(false);
    }}
    >
      <span className='list-title'>{note?.title}</span>
      <p id="dateOfNote">{note.content}</p>
      </li>
      );

      const displayBook = (notebook) => {
          if (notebook === "All Notes") {
              return Object.values(notes).map((note) => setBook(note));
    } else {
      return Object.values(notes).map((note) => {
        if (note.notebookId === currentNotebook.id) {
          return setBook(note);
        }
      });
    }
  };


  function postNewNote() {
    setCurrentTitle("");
    setMainNoteContent("");
    setCurrentNote("");
    setNewNoteTitle("");
    setContent("");
    setNewNote(true);
  }


  return (
    <div className='main-notes'>
      <div className="notebook-bar">

        <div className='notebooks'>
            {Object.keys(notebooks).map((key) => (
              <div
                className="each-book"
                key={key}
                onClick={() => setCurrentNotebook(notebooks[key])}
              >
                | {notebooks[key].name} |
              </div>
            ))}
        </div>
        <div>
          <div>
            <input
              className='new-book-title'
              placeholder="New Notebook..."
              onChange={(e) => setName(e.target.value)}
              required="required"
            ></input>
            <button
              className='add-book-bttn'
              type="submit"
              onClick={postBook}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="note-preview">
        <div className='notebook-title'>
          <h1>
            {currentNotebook.name || currentNotebook}
          </h1>
          {currentNotebook != "All Notes" ? (
            <h1 onClick={() => setOpen(!open)}>
             <img src='https://res.cloudinary.com/dzjkwepju/image/upload/v1637301508/Styckr/Untitled_design_5_ic3wy6.png' alt='edit'/>
            </h1>
          ) : (
            ""
          )}
        </div>
        <button onClick={postNewNote}>
          Create note
        </button>
        <ul className='list-notes'>{displayBook(currentNotebook)}</ul>
      </div>
      <div className="taking-notes">
        {open && (
          <div >
            <form  onSubmit={changeBookName}>
              <input
                placeholder="New notebook name.."
                required
                onChange={(e) => setNewNotebookTitle(e.target.value)}
              ></input>
              <button id="editNotebookButton" type="submit">
                Edit name
              </button>
              <button id="deleteNotebookButton" onClick={handleBookDelete}>
                Delete notebook
              </button>
            </form>
          </div>
        )}
        <form className='note-form'>
          <input
            className='book-title'
            placeholder="Name your note..."
            value={currentTitle ? currentTitle : title}
            onChange={
              newNote
                ? (e) => setNewNoteTitle(e.target.value)
                : (e) => setCurrentTitle(e.target.value)
            }
          ></input>
            <div >
              <button className='delete-note' onClick={handleNoteDelete}>
                <img className='delete-icon' src='https://res.cloudinary.com/dzjkwepju/image/upload/v1637285228/Styckr/Untitled_design_4_cnhbc4.png' alt='delete'/>
              </button>
              <button className='save-note' onClick={handleSubmit}>
              <img className='save-icon' src='https://res.cloudinary.com/dzjkwepju/image/upload/v1637285174/Styckr/Untitled_design_3_yhtnq6.png' alt='save'/>
              </button>
            </div>
          <textarea
           className='note-loca'
            placeholder="Your Stellar Notes Go Here!"
            onChange={
              newNote
                ? (e) => setContent(e.target.value)
                : (e) => setMainNoteContent(e.target.value)
            }
            value={currentContent ? currentContent : content}
          ></textarea>
          <div>
            <p >
              {currentNotebook.name ? currentNotebook.name : currentNotebook}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TheNotes;
