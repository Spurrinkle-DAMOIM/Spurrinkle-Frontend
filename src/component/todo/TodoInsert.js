import { MdAdd } from 'react-icons/md';
import '../../css/todo/TodoInsert.scss';
import { useState, useCallback } from 'react';

const TodoInsert = ({ onInsert }) => {
    const [value, setValue] = useState('');

    const onchange =  useCallback(e => {
        setValue(e.target.value);
    },[]);

    const onsubmit = useCallback(e => {
        e.preventDefault();
        onInsert(value);
        setValue('');
    },[onInsert, value],)

    const onclick = useCallback(e =>{
        e.preventDefault();
        onclick(value);
        setValue(e.target.value);
    })

    return (
        <form className="TodoInsert" onSubmit={onsubmit}>
            <input placeholder="할 일을 입력하세요"
                   style={{fontSize:"16px"}}
                   value={value}
                   onChange={onchange}
                   onClick={onclick}/>
            <button type="submit">
                <MdAdd />
            </button>
        </form>
    );
};

export default TodoInsert;
