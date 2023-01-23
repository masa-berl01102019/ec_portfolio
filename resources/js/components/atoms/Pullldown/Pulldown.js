import React, {memo, useState} from 'react';
import styles from './styles.module.css';

const Pulldown = ({children, name, value, onChange, className = '', defaultOption = '未設定'}) => {

  const [open, setOpen] = useState(false);

  // childrenが複数ないと配列型で渡ってこずエラーになってしまう
  let defaultValue = Array.isArray(children) ? children.filter(child => child.props.value == value).map(el => el.props.children).join('') : null; 

  return (
    <div className={[styles.container, className].join(' ')}>
      <div className={[styles.base_select, open ? styles.select_open : styles.select_close].join(' ')} onClick={() => setOpen(!open)}>
        <span>{defaultValue ? defaultValue : defaultOption}</span>
      </div>
      { open == true &&
        <ul className={styles.ul}>
          <li>
            <label className={styles.label}>
              <input 
                type='radio' 
                name={name} 
                value='' 
                onClick={e => {onChange(e); setOpen(false)}} 
                className={styles.hidden}
                defaultChecked={value === ''}
              />
              未設定
            </label>
          </li>
          { Array.isArray(children) ? (
              children.map((child, index) => (
                <li key={index} className={styles.list}>
                  <label className={styles.label}>
                    <input 
                      type='radio' 
                      name={name} 
                      value={child.props.value} 
                      onClick={e => {onChange(e); setOpen(false)}} 
                      className={styles.hidden}
                      defaultChecked={value === child.props.value}
                    />
                    {child.props.children}
                  </label>
                </li>
              ))
            ) : (
              <li className={styles.list}>
                <label className={styles.label}>
                  <input 
                    type='radio' 
                    name={name} 
                    value={children.props.value} 
                    onClick={e => {onChange(e); setOpen(false)}} 
                    className={styles.hidden}
                    defaultChecked={value === children.props.value}
                  />
                  {children.props.children}
                </label>
              </li>
            )
          }
        </ul>
      }
    </div>
  );
};

export default Pulldown;