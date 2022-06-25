/**
 * Interacts with the locale storage. Hence, it is the responsible
 * for all main actions being made like getting all existing notes,
 * saving the note to the locale storage, and deleting the note.
 * 
 */
export default class NotesAPI {

    /**
     * Retrieve all existing notes in the local storage
     *
     * @returns sorted list of notes by date of update
     */
    static getAllNotes() {
        // Get existing notes else generate empty array
        const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");

        // Sorts out by date
        return notes.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }

    /**
     * Automatically saves the active note when not focused.
     * 
     * @param {obj} All information about the active note
     * @returns updated list of notes
     */
    static saveNote(noteToSave) {
        const notes  = NotesAPI.getAllNotes();    // Retrieve all existed notes
        const existing = notes.find(note => note.id == noteToSave.id);

        // Update/Add
        if (existing) {
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toISOString();
        } else {
            noteToSave.id = Math.floor(Math.random() * 1000000);    // Generate random id
            noteToSave.updated = new Date().toISOString();
            notes.push(noteToSave);
        }

        // Updates the list of notes
        localStorage.setItem("notesapp-notes", JSON.stringify(notes));
    }

    /**
     * Delete selected note by clicking the delete button.
     * 
     * @param {id} id of the note that will be deleted.
     * @returns updated list of notes without the deleted note.
     */
    static deleteNote(id) {
        const notes  = NotesAPI.getAllNotes();    // Retrieve all existen notes
        const newNotes = notes.filter(note => note.id != id);    // Filter out selected note

        // Updates the list of notes
        localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
    }
}
