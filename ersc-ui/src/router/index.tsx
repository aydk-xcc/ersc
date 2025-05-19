
import CodeReader from '../views/code/CodeReader';
import FileRelative from '../views/file-relative/file';
import { Routes, Route } from "react-router";
import PlLayout from '../components/layout/Layout';
import Login from '../views/login/login';

export default function CusRouters() {
    return (
        <Routes>
            <Route path="/" element={<PlLayout />}>
                <Route path="graph" element={<CodeReader />} />
                <Route path="code" element={<CodeReader />} />
                <Route path="note" element={<FileRelative />} />
            </Route>
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}
