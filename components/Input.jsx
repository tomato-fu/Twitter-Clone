import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { useState, useRef } from "react";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { async } from "@firebase/util";
import { useSession } from "next-auth/react";
const Input = () => {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectFile, setSelectFile] = useState(null);
  const filePickerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
  };
  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.tag,
      text: input,
      timestamp: serverTimestamp(),
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectFile) {
      await uploadString(imageRef, selectFile, "data_url").then(async () => {
        const downLoadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downLoadURL,
        });
      });
    }
    setLoading(false);
    setInput("");
    setSelectFile(null);
    setShowEmojis(false);
  };
  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectFile(readerEvent.target.result);
    };
  };
  return (
    <div
      className={` border-b border-gray-700 p-3 flex space-x-3 ${
        loading && "opacity-60"
      } `}
    >
      <img
        src={session.user.image}
        alt=""
        className="h-10 w-10 rounded-full xl:mr-2.5 cursor-pointer"
      />

      <div className=" flex-1 divide-y divide-gray-700">
        <div className={`${selectFile && "pb-7"} ${input && "space-y-2"}`}>
          <textarea
            value={input}
            rows="2"
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's up?"
            className=" bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[50px]"
          ></textarea>
          {selectFile && (
            <div className="relative">
              <div className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center cursor-pointer top-1 left-1 ">
                <XIcon
                  className="text-white h-5"
                  onClick={() => setSelectFile(null)}
                />
              </div>
              <img
                src={selectFile}
                alt=""
                className="rounded-2xl max-h-80 object-contain"
              />
            </div>
          )}
        </div>
        {!loading && (
          <div className="flex items-center justify-between pt-2.5">
            <div className="flex items-center relative">
              <div
                className="icon"
                onClick={() => filePickerRef.current.click()}
              >
                <PhotographIcon className="h-[22px] text-[#1d9bf0]" />
                <input
                  type="file"
                  hidden
                  onChange={addImageToPost}
                  ref={filePickerRef}
                />
              </div>
              <div className="icon rotate-90">
                <ChartBarIcon className="h-[22px] text-[#1d9bf0]" />
              </div>

              <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
                <EmojiHappyIcon className="h-[22px] text-[#1d9bf0]" />
              </div>

              <div className="icon">
                <CalendarIcon className="h-[22px] text-[#1d9bf0]" />
              </div>

              {showEmojis && (
                <Picker
                  onSelect={addEmoji}
                  style={{
                    position: "absolute",
                    top: "36px",
                    maxWidth: "300px",
                    marginLeft: -40,
                    borderRadius: "20px",
                  }}
                  theme="dark"
                />
              )}
            </div>
            <button
              className="bg-[#1d9bf0] text-white rounded-full px-2 py-1 font-bold shadow-md hover:bg-[#1a8cd8] 
  disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default sm:px-3 sm:py-1.5 "
              disabled={!input.trim() && !selectFile}
              onClick={sendPost}
            >
              Tweet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
