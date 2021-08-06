import axios from 'axios';
import StudentModel from '@/model/StudentModel';
import RegistrationDetailModel from '@/model/RegistrationDetailModel';

export default class StudentController {
    public static async GetStudents(): Promise<StudentModel[]> {
        const res = await axios.get<StudentModel[]>('./data/student.json');
        return (res.data) ? res.data : [];
    }
    public static async GetRegisteredStudents(): Promise<RegistrationDetailModel[]> {
        const res = await axios.get<RegistrationDetailModel[]>('./data/registeredStudents.json');
        return (res.data) ? res.data : [];
    }
}