import NotesAPI from "./NotesAPI.js";
import NotesView from "./NotesView.js";

/**
 * Manages NotesAPI and NotesView
 */
export default class App {

    constructor(root) {
        this.notes = [];
        this.activeNote = null;
        this.view = new NotesView(root, this._handlers());

        this._refreshNotes();
    }

    /**
     * @returns new sorted list and if there is an existing note make it active
     */
    _refreshNotes() {
        const notes = NotesAPI.getAllNotes();

        this._setNotes(notes);

        if (notes.length > 0) {
            this._setActiveNote(notes[0]);
        }
    }

    /**
     * Keep tracks on the list of notes
     * @param {dict} List of notes
     */
    _setNotes(notes) {
        this.notes = notes;
        this.view.updateNoteList(notes);
        this.view.updateNotePreviewVisibility(notes.length > 0);
    }

    /**
     * Show the active note
     *
     * @param {obj}
     * @returns make the {obj} active
     */
    _setActiveNote(note) {
        this.activeNote = note;
        if (note !== undefined) {
            this.view.updateActiveNote(note);
        }
    }

    /**
     * @returns obj that being done by the user
     */
    _handlers() {
        return {
            onNoteSelect: noteId => {
                const selectedNote = this.notes.find(note => note.id == noteId);
                this._setActiveNote(selectedNote);
            },

            onNoteAdd: () => {
                // Default data
                const newNote = {
                    title: "",
                    body: ""
                };

                NotesAPI.saveNote(newNote);
                this._refreshNotes();
            },

            onNoteEdit: (title, body) => {
                NotesAPI.saveNote({
                    id: this.activeNote.id,
                    title,
                    body
                });

                this._refreshNotes();
            },

            onNoteDelete: noteId => {
                NotesAPI.deleteNote(noteId);
                this._refreshNotes();
            },
        };
    }
}
