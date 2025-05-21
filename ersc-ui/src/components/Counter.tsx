import React from 'react';
import { useAppSelector, useAppDispatch } from '@/stores/hooks';
import { increment, decrement, incrementByAmount, selectCount } from '@/stores/counterSlice';

const Counter: React.FC = () => {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = React.useState('2');

  const incrementValue = Number(incrementAmount) || 0;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          aria-label="减少值"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
        <span>{count}</span>
        <button
          aria-label="增加值"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <input
          aria-label="设置增量数量"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <button
          onClick={() => dispatch(incrementByAmount(incrementValue))}
        >
          添加数量
        </button>
      </div>
    </div>
  );
};

export default Counter; 