import { MdCheckBoxOutlineBlank, MdCheckBox, MdRemoveCircleOutline } from 'react-icons/md';
import '../../css/todo/TodoListItem.scss';
import cn from 'classnames';

const TodoListItem = ({todo, onRemove, onToggle}) => {
    const {id, content, checked} = todo;
    console.log("들어온 반복 데이터 : ", todo);
    return (
        <div className="TodoListItem">
            <div className={cn('checkbox', {checked})} onClick={ () => onToggle(id)}>
                {checked ? <MdCheckBox/> : <MdCheckBoxOutlineBlank/>}
                <div className="text">{content}</div>
            </div>
            <div className="remove" onClick={() => onRemove(id)}>
                <MdRemoveCircleOutline/>
            </div>
        </div>
    );
};

export default TodoListItem;
