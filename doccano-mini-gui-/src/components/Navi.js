import React from 'react';
import styled from 'styled-components';
import NavItem from './NavItem';

const NaviContainer = styled.div`
    padding: 4px;
    border: 1px solid;
    display: flex;
`;

const Navi = ({data, current, prev, nextaction}) => {
    if(data){
        const {count, next, previous, results} = data;
        console.log('data',data);
        console.log('data', count, next, previous, results);
        console.log('current', current);
        let idx = 0;
        if(results){
            idx = results.indexOf(current);
        }
        console.log(idx);
        let disableprev=false;
        if(idx === 0){
            disableprev = true;
        }
        let disablenext=false;
        if(results && idx === count - 1){
            disablenext = true;
        }
        return (
            <NaviContainer>
                <div>
                    <NavItem data={{text:'Prev', suffix_key:'<', action:prev}} disabled={disableprev}></NavItem>
                    <NavItem data={{text:'Next', suffix_key:'>', action:nextaction}} disabled={disablenext}></NavItem>
                </div>
            </NaviContainer>
  )};
}

export default Navi;
