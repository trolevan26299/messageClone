// import '../styles/globals.css'
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "../components/Loading";
import { auth, db } from "../config/firebase";
import Login from "./login";

function MyApp({ Component, pageProps }: AppProps) {
  //xử lý đăng nhập
  const [loggedInUser, loading, _error] = useAuthState(auth);
  useEffect(() => {
    const setUserInDb = async () => {
      try {
        await setDoc(
          doc(db, "users", loggedInUser?.email as string), // hàm này tạo một colection trong firebase là user nếu chưa có và lưu db  đó vào colection user
          {
            email: loggedInUser?.email,
            lastSeen: serverTimestamp(), //ghi lại time người dùng login
            photoURL: loggedInUser?.photoURL,
          },
          { merge: true } // code này giúp khi đăng nhập lần 2 vẫn giống  email như lần 1 thì không lưu thêm 1 email nữa và sẽ update lassSeen nếu như có update
        );
      } catch (error) {
        console.log("error", error);
      }
    };
    if (loggedInUser) {
      setUserInDb();
    }
  }, [loggedInUser]);

  if (loading) return <Loading />;
  if (!loggedInUser) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;
