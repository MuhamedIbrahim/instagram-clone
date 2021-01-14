import React, {useState} from 'react';

export const EditProfileContext = React.createContext({
    isEditing: false,
    setIsEditing: () => {}
})

const EditProfileProvider = props => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <EditProfileContext.Provider value={{
            isEditing: isEditing,
            setIsEditing: setIsEditing
        }}>
            {props.children}
        </EditProfileContext.Provider>
    );
}

export default EditProfileProvider;