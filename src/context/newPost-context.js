import React, {useState} from 'react';

export const NewPostContext = React.createContext({
    isPosting: false,
    setIsPosting: () => {}
});

const NewPostProvider = props => {
    const [isPosting, setIsPosting] = useState(false);

    return (
        <NewPostContext.Provider value={{
            isPosting: isPosting,
            setIsPosting: setIsPosting
        }}>
            {props.children}
        </NewPostContext.Provider>
    )
};

export default NewPostProvider;