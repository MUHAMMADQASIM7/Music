import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import { Navigate, useNavigate } from 'react-router-dom';
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    getStorage,
    listAll
} from "firebase/storage";
import AudioPlayer from 'react-h5-audio-player';

const Main = () => {

    const [role, setRole] = useState<any>()
    const [admin, setAdmin] = useState(false)
    const [person, setPerson] = useState(false)
    const [percent, setPercent] = useState(0)
    const [file, setFile] = useState<any>()
    const [audio,setAudio] = useState<any>()


    const userid: any = sessionStorage.getItem("data");
    const id = JSON.parse(userid)

    const combined = id?.uid

    const navigate = useNavigate();

    useEffect(() => {
        if (id !== '') {
            const unsub = onSnapshot(doc(db, "users", combined), (doc) => {
                doc.exists() && setRole(doc.data().role)
            })
            if (role === 'admin') {
                setAdmin(true)
                unsub()
                
            }
            if (role === 'person') {
                setPerson(true)
                unsub()
            }
            

        }

    }, )

    function handleChange(event: any) {
        setFile(event.target.files[0]);
    }

    function handleUpload() {
        if (!file) {
            alert("Please choose a file first!")
        }
        const storage = getStorage();
        const storageRef = ref(storage, `/files/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                // update progress
                setPercent(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    
                    updateDoc(doc(db, "userChats", combined), {
                        
                          
                        messages: arrayUnion({
                            
                            audio: url,
                          }),
                        
                      });
                });
            }
        );
    }
    useEffect(() => {
        if(person || admin ){
            onSnapshot(doc(db, "userChats", "wz5S3oXjyrPcYYdk6yPfH8mtlRL2"), (doc) => {
                doc.exists() && setAudio(doc.data().messages);
                // console.log("New Chats:", doc.data()?.messages)
              });
        
      
        }
    },[person,admin])


    const handlelog = () => {
        auth.signOut();
        sessionStorage.removeItem("data")
        navigate('/Sign-in')
        console.log(role)
    };
    return (
        <div>
            <button onClick={handlelog}>Logout</button>
            {admin &&
                (
                    <div>
                        <input type="file" onChange={handleChange} accept='/audio/*' />
                        <button onClick={handleUpload}>Upload to Firebase</button>
                        <p>{percent} "% done"</p>
                    </div>

                )

            }
           
            
  {audio?.map( (aud: any) => <div key={aud.audio}>
     <AudioPlayer
     src={aud.audio}
    />
    </div>

  )}
    

        </div>
    )




}

export default Main;