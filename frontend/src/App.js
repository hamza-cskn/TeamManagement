import './App.css';
import {HomePage} from "./pages/HomePage";
import {IssuesPage} from "./pages/issue/IssuesPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {NotFoundPage} from "./pages/404Page";
import {IssuePage} from "./pages/issue/IssuePage";
import {LoginPage} from "./pages/auth/LoginPage";
import PrivateRoutes from "./pages/auth/PrivateRoute";
import {ChatPage} from "./pages/chat/ChatsPage";
import {IssueCreatePage} from "./pages/issue/IssueCreatePage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PrivateRoutes/>}>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/issues" element={<IssuesPage/>}/>
                    <Route path="/issues/*" element={<IssuePage/>}/>
                    <Route path="/issues/create" element={<IssueCreatePage/>}/>
                    <Route path="/chat" element={<ChatPage/>}/>
                </Route>
                <Route path="*" element={<NotFoundPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
