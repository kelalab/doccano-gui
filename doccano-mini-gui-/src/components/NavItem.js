import React from 'react';
import styled, { css } from 'styled-components';
import useEventListener from '../events';

const ItemContainer = styled.div`
    padding: 4px;
    border: 1px solid;
    display: flex;
    ${props => props.disabled && css`
        background: lightgray;
        color: gray;
    `}
`;

const Key = styled.span`
    border: 1px solid;
    border-radius: 99px;
    padding: 2px 4px;
    margin-left: 4px;
    &:hover {
        background: gray;
    }
`

const NavItem = ({data, disabled}) => {
    const {text, suffix_key} = data;
    const handleKey = ({key}) => {
        //console.log('handleKey', key);
        //console.log('suffix', data.suffix_key);
        //console.log(key === data.suffix_key);
        if(data.action){
            if(key==='ArrowRight'){
                console.log('handleKey', key);
                if(data.action && data.suffix_key === '>'){
                    data.action();
                    return;
                }
            }
            if(key==='ArrowLeft'){
                console.log('handleKey', key);
                if(data.action && data.suffix_key === '<'){
                    data.action();
                    return;
                }
            }
            
        }
    }
    useEventListener('keydown', handleKey);
  return (
      <ItemContainer disabled={disabled}>
            <div>{text}</div><Key>{suffix_key}</Key>
      </ItemContainer>
  )};

export default NavItem;
