/**
 * This is the responsible of generating the UI of the application.
 */
export default class NotesView {
    
    /**
     * Initalizes the base of the application, this also compose all
     * the data needed for the application.
     *
     * @param {root} The main view of application
     * @param {object} Empty by default with different kinds of properties
     * @returns renders the UI
     */
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.root.innerHTML = `
            <section id="sidebar-1" class="notes__sidebar notes__sidebar sidenav sidenav-fixed">
                <div class="notes__list">
                </div>
                <button type="button" class="notes__add waves-effect waves-light">
                    <span class="button__text">New Note</span>
                    <span class="button__icon">
                        <i class="material-icons">add</i>
                    </span>
                </button>
            </section>

            <section class="notes__preview d-flex flex-column">
                <div class="input-field">
                    <input type="text" id="title" class="notes__title">
                    <label for="title">Title</label>
                </div>
                <textarea class="notes__body materialize-textarea" placeholder="Write here..." onkeyup='this.style.height = "";this.style.height = this.scrollHeight + "px"'></textarea>
            </section>
        `;

        const btnAddNote = this.root.querySelector(".notes__add");
        const inpTitle = this.root.querySelector(".notes__title");
        const inpBody = this.root.querySelector(".notes__body");

        /**
         * @returns Generate new note
         */
        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        /**
         * Automatically saves when input field is not focused.
         * @returns updates the active note
         */
        [inpTitle, inpBody].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();

                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });

        // Hides the preview of note by default
        this.updateNotePreviewVisibility(false);

        // Sidenav - materializecss
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.sidenav');
            var instances = M.Sidenav.init(elems, { edge: 'left' });
        });
    }

    /**
     * @returns Generates cards/notes in the sidebar
     */
    _createListItemHTML(id, title, body, updated) {

        // Maximum char in the card/note in sidebar
        const MAX_BODY_LENGTH = 60;

        return `
            <div class="notes__list-item card" data-note-id="${id}">
                <div class="card-stacked>
                    <div class="card-content">
                        <div class="notes__small-title">${title}</div>
                        <div class="notes__small-body">
                            ${body.substring(0, MAX_BODY_LENGTH)}
                            ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                        </div>
                        <div class="notes__small-updated">
                            ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                        </div>
                    </div>
                    <div class="card-action">
                        <button class="notes__delete" role="button"><i class="material-icons">delete</i></button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Updates the card/notes in the sidebar when active note is not focused.
     * 
     * @param {dict} list of notes
     */
    updateNoteList(notes) {
        
        const notesListContainer = this.root.querySelector(".notes__list");

        // Make list of notes empty by default
        notesListContainer.innerHTML = "";

        // Generates list of notes
        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));
            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        // Add select/delete events for each list item
        notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });

            noteListItem.querySelector(".notes__delete").addEventListener("click", () => {
                const doDelete = confirm(`Are you sure you want to delete this note? \"${this.root.querySelector(".notes__small-title").textContent}\"`);
                if (doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });
        });
    }

    /**
     * Takes the active note and make it visible in the sidebar
     *
     * @param {obj} Active note 
     * @returns add css effect to show visibility in the sidebar
     */
    updateActiveNote(note) {
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;

        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.classList.remove("notes__list-item--selected");
        });

        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
    }

    /**
     * Remove editor if no note is selected
     *
     * @param {bool} either make it visible or not
     */
    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
    }
}
