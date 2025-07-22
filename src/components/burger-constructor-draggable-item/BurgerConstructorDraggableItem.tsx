import { IConstructorIngredient } from '../../../utils/types.ts';
import { useDrag, useDrop } from 'react-dnd';
import styles from './burger-constructor-draggable-item.module.css';
import {
  ConstructorElement,
  DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import {
  move,
  removeFilling,
} from '../../services/slices/burgerConstructorSlice.ts';
import { useAppDispatch } from '../../services/hooks.ts';
import { useEffect, useRef } from 'react';

interface MyComponentProps {
  ingredient: IConstructorIngredient;
  index: number;
}

const BurgerConstructorDraggableItem = ({
  ingredient,
  index,
}: MyComponentProps) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    drag(drop(ref));
  });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'constructorIngredient',
    item: ingredient,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'constructorIngredient',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop: (item: IConstructorIngredient) => {
      if (item.index !== index) {
        dispatch(move({ dragIndex: item.index, hoverIndex: index }));
      }
    },
  }));

  const handleClose = () => {
    dispatch(removeFilling(ingredient.key));
  };

  return (
    <div
      className={`${styles.container} ${isDragging ? styles.dragging : ''} ${isOver ? styles.highlight : ''} pb-4`}
      key={ingredient.key}
      ref={ref}
    >
      <DragIcon type="primary" className={styles.drag} />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        extraClass="ml-3 pr-2"
        handleClose={handleClose}
      />
    </div>
  );
};

export default BurgerConstructorDraggableItem;
