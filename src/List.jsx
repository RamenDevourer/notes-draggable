import React, {useState,useEffect,useRef} from 'react'

function List(){

    const [list, setList] = useState(["Example Note"]);
    const [newNote, setNewNote] = useState("");
    const startEvent = useRef(null);
    const endEvent = useRef(null);

    function handleAddNoteInput(event){
        setNewNote(event.target.value);
    }

    function handleAddNote(){
        if(newNote.trim() !== ""){
            setList(l => [...l, newNote]);
            setNewNote("");
        }
    }

    function handleRemoveNote(index){
        const updatedList = list.filter((_, i) => i !==index);
        setList(updatedList); 
    }

    function handleNoteUp(index) {
        if (index > 0){
            const updatedList = [...list];
            [updatedList[index], updatedList[index - 1]] = [updatedList[index - 1], updatedList[index]];
            setList(updatedList);
        }
    }

    function handleNoteDown(index) {
        if (index < list.length - 1){
            const updatedList = [...list];
            [updatedList[index], updatedList[index + 1]] = [updatedList[index + 1], updatedList[index]];
            setList(updatedList);
        }
        
    }

    // adding dragging functionality (old code unoptimized)
    // useEffect(() => {
    //     const draggables = document.querySelectorAll('.draggable');
    //     const container = document.querySelector('ul');
    //     console.log(container);
    //     draggables.forEach(draggable => {
    //         startEvent.current = draggable.addEventListener( 'dragstart', () => {
    //             draggable.classList.add('dragging')
    //         });
    //         endEvent.current = draggable.addEventListener('dragend', () => {
    //             draggable.classList.remove('dragging')
    //         })
    //     return () => {
    //         draggable.removeEventListener('dragstart', startEvent.current);
    //         draggable.removeEventListener('dragend', endEvent.current);
    //     }
    // },[list]);

    // container.addEventListener('dragover', e => {
    //     e.preventDefault();
    //     const afterElement = getDragElement(container, e.clientX, e.clientY);
    //     let indexDragged = document.querySelector('.dragging').id;
    //     let indexAfter = afterElement.id;
    //     // let newList = list.filter((element, index) => index !== Number(indexDragged));
    //     // newList.splice(indexAfter, 0, list[indexDragged]);
    //     let newList = [...list];
    //     newList.splice(indexAfter, 0, newList.splice(indexDragged, 1)[0]);
    //     // setList(newList);
    //     container.insertBefore(document.querySelector('.dragging'),afterElement);
    //     console.log(newList);
    //     // setList(l => [...l.slice(0,indexAfter),...]);
    //     console.log(indexDragged);
    //     if (afterElement == null){
            
    //     }
    //     console.log(indexAfter);
    // })

    
    // function getDragElement(container, x, y) {
    //     const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

    //     return draggableElements.reduce((closest, child) => {
    //         const box = child.getBoundingClientRect();
    //         const offsetY = y - box.top - box.height;
    //         const offsetX = x - box.left - box.width;
    //         if (offsetY < 0 && offsetY > closest.offsetY){
    //             if (offsetX < 0 && offsetX > closest.offsetX){
    //                 return {offsetX: offsetX, offsetY: offsetY, element: child};
    //             }
    //             else {
    //                 return closest;
    //             }
    //         }
    //         else {
    //             return closest;
    //         }
    //     }, {offsetY: Number.NEGATIVE_INFINITY, offsetX: Number.NEGATIVE_INFINITY}).element;
    // }

    // });


    // adding drag functionality (new code optimized)
    function getDragElement(container, x, y) {
        const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offsetY = y - box.top - box.height;
            const offsetX = x - box.left - box.width;
            if (offsetY < 0 && offsetY > closest.offsetY){
                if (offsetX < 0 && offsetX > closest.offsetX){
                    return {offsetX: offsetX, offsetY: offsetY, element: child};
                }
                else {
                    return closest;
                }
            }
            else {
                return closest;
            }
        }, {offsetY: Number.NEGATIVE_INFINITY, offsetX: Number.NEGATIVE_INFINITY}).element;
    }

    useEffect(() => {
        const container = document.querySelector('ul');
        const draggables = container.querySelectorAll('.draggable');
    
        function handleDragStart() {
            this.classList.add('dragging');
        }
    
        function handleDragEnd() {
            this.classList.remove('dragging');
        }
    
        function handleDragOver(e) {
            e.preventDefault();
            const afterElement = getDragElement(container, e.clientX, e.clientY);
            if (afterElement) {
                const draggedElement = document.querySelector('.dragging');
                container.insertBefore(draggedElement, afterElement);
            }
        }
    
        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', handleDragStart);
            draggable.addEventListener('dragend', handleDragEnd);
        });
    
        container.addEventListener('dragover', handleDragOver);
    
        return () => {
            draggables.forEach(draggable => {
                draggable.removeEventListener('dragstart', handleDragStart);
                draggable.removeEventListener('dragend', handleDragEnd);
            });
    
            container.removeEventListener('dragover', handleDragOver);
        };
    }, [list]);

    return (
        <>
            <h1>Notes</h1>
            <ul>
                {list.map((note, index) => 
                <li key={index} id={index} className={`draggable`} draggable="true">
                    <div className='note'>
                        <span>{note}</span>
                        <div className='list-buttons' >
                            <button className='move-button' onClick={() => handleNoteUp(index)}>Move Up</button>
                            <button className='move-button' onClick={() => handleNoteDown(index)}>Move Down</button>
                            <button className='delete-button' onClick={() => handleRemoveNote(index)}>Delete</button>
                        </div>
                    </div>
                </li>
                )}
                <li id="add-note" className={`draggable`}>
                    <div className='note'>
                        <textarea onChange={handleAddNoteInput} type='text' value={newNote} id='add-note-input' placeholder='Enter Note'/>
                        <div>
                            <button className='add-button' onClick={handleAddNote}>Add Note</button>
                        </div>
                    </div>
                </li>
            </ul>
        </>
    );
}

export default List;