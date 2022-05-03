export const combineToMsg = (messageId, data) => {
    let firstFoundPiece = null;
    /** Search logic that may need to be moved to a different function */
    for(const item of data){
        if(item.meta.messageId === messageId){
            firstFoundPiece = item;
            break;
        }
    } 
    let msg = '';
    if(firstFoundPiece.meta.prev){
        let i = firstFoundPiece;
        msg = firstFoundPiece.text;
        while(i.meta.prev >= 0){
            i = data.find(item => item.id === i.meta.prev);
            msg = i.text + ' ' + msg;
        }
        msg = msg.trim();
        i = firstFoundPiece;
        while(i.meta.next >= 0 ){
            i = data.find(item => item.id === i.meta.next);
            msg = msg + ' ' + i.text;
        }
    }else{
        let i = firstFoundPiece;
        msg = firstFoundPiece.text;
        while(i.meta.next >= 0){
            i = data.find(item => item.id === i.meta.next);
            msg = msg + ' ' + i.text;
        }
    }
    return msg.trimEnd();
}

export const splitMsg = (message) => {
    let arr = message.split('.');
    for(let i = 0; i<arr.length; i++){
        if(arr[i].length > 0){
            arr[i] = arr[i].trim()+'.';
        }
    }
    //remove empty element from end
    arr.pop();
    return arr;
}