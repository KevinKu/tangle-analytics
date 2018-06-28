import React from 'react';
import {render} from 'react-dom';
import reducer from './reducer';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import TangleContainer from './containers/TangleContainer';

const store = createStore(reducer);

render(
  <Provider store={store}>
	 <div>
      <div className='title-bar-container'>
        <div className='left-title'>
          <h2> Tangle Analyst</h2>
        </div>
        <div className='right-title'>
          <p>
            
          </p>
          <p>
           
          </p>
        </div>
      </div>
      <TangleContainer />
    </div>
  </Provider>,
  document.getElementById('container')
);
