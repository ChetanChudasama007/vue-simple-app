import RegistrationDetailModel from '@/model/RegistrationDetailModel';
import Vue from 'vue';
import Vuex, { ActionTree, MutationTree, GetterTree } from 'vuex';
import StudentModel from '@/model/StudentModel';
Vue.use(Vuex);

export interface State {
    Students: StudentModel[];
    registeredStudents: RegistrationDetailModel[];
    authenticated: boolean;
    userRole: string;
}

const actions: ActionTree<State, any> = {
};
const mutations: MutationTree<State> = {
    setStudents: (s: State, studentModel: StudentModel[]) => {
        s.Students = studentModel;
    },
    setAuthentication: (s: State, isAuthenticated: boolean) => {
        s.authenticated = isAuthenticated;
    },
    setRegisteredStudents: (s: State, registrationRecords: RegistrationDetailModel[]) => {
        s.registeredStudents = registrationRecords;
    },
    setUserRole: (s: State, role: string) => {
        s.userRole = role;
    },
};
const getters: GetterTree<State, State> = {
    getStudents: () => () => {
        if (store.state.Students) {
            return store.state.Students;
        }
        return [];
    },
    getRegisteredStudents: () => () => {
        if (store.state.registeredStudents) {
            return store.state.registeredStudents;
        }
        return [];
    },
    getUserRole: () => () => {
        if (store.state.userRole !== "") {
            return store.state.userRole;
        }
        return "";
    },
};
const state: State = {
    Students: [],
    registeredStudents: [],
    authenticated: false,
    userRole: "",
};
const store = new Vuex.Store<State>({
    state,
    mutations,
    actions,
    getters,
});
export default store;

