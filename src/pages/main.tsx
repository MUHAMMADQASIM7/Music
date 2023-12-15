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
    const [audio, setAudio] = useState<any>()
    const [audio1, setAudio1] = useState<any>()
    const [activeAudio, setActiveAudio] = useState(null);
    const [activeAudio1, setActiveAudio1] = useState(null);
    const [upload, setUpload] = useState(false)
    const [playlist, setPlaylist] = useState(false)

    const handleClick = (index: any) => {
        if (index === activeAudio) {
            setActiveAudio(null); // Pause if clicked again
        } else {
            setActiveAudio(index);
        }
    };

    const handleClick1 = (index: any) => {
        if (index === activeAudio) {
            setActiveAudio1(null); // Pause if clicked again
        } else {
            setActiveAudio1(index);
        }
    };



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

    },)

    function handleChange(event: any) {
        setFile(event.target.files[0]);
        setUpload(true)
        setPercent(0)
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
                            name: file.name,
                            audio: url,
                        }),

                    });
                });
            }
        );
        setUpload(false)
    }
    useEffect(() => {
        if (person || admin) {
            onSnapshot(doc(db, "userChats", "wz5S3oXjyrPcYYdk6yPfH8mtlRL2"), (doc) => {
                doc.exists() && setAudio(doc.data().messages.reverse());
                // console.log("New Chats:", doc.data()?.messages)
            });


        }
    }, [person, admin])


    const handlelog = () => {
        auth.signOut();
        sessionStorage.removeItem("data")
        sessionStorage.removeItem("auth")
        
        navigate('/Sign-in')
        
    };

    const handleplaylist = (aud: any) => {

        updateDoc(doc(db, "userChats", combined), {


            messages: arrayUnion({
                name: aud.name,
                audio: aud.audio,
            }),

        });


    }

    const show = () => {
        setPlaylist(true)
    }

    useEffect(() => {
        if (playlist) {
            onSnapshot(doc(db, "userChats", combined), (doc) => {
                doc.exists() && setAudio1(doc.data().messages);
                // console.log("New Chats:", doc.data()?.messages)
                console.log(audio1)

            });


        }
    }, [playlist, person])


    return (
        <div>
            <button onClick={handlelog}>Logout</button>
            {admin &&
                (
                    <div>
                        <input type="file" onChange={handleChange} accept='/audio/*' />
                        {upload &&
                            <button onClick={handleUpload}>Upload to Cloud</button>
                        }
                        <p>{percent} "% done"</p>
                    </div>

                )

            }


            {audio?.map((aud: any, index: any) => (
                <div key={aud.audio}>
                    <div
                        onClick={() => handleClick(index)}
                        style={{
                            cursor: 'pointer',
                        }}
                    >
                        Music:{index + 1}_{aud.name}
                        {person &&
                        <button value={aud} onClick={() => handleplaylist(aud)} >Add To Playlist</button>
}
                    </div>
                    {index === activeAudio && <AudioPlayer src={aud.audio} />}
                </div>
            ))}
            {person &&
                <span>PlayList
                    <button onClick={show} >Show</button>

                </span>
            }
            {person &&

                audio1?.map((aud1: any, index: any) => (
                    
                    <div key={aud1.audio}>
                        <div
                            onClick={() => handleClick1(index)}
                            style={{
                                cursor: 'pointer',
                            }}
                        >
                            Music:{index + 1}_{aud1.name}
                        </div>
                        {index === activeAudio1 && <AudioPlayer src={aud1.audio} />}
                    </div>
                ))
            }
        </div>
    )
};

export default Main;