import { writable } from 'svelte/store';

type user = {
	name: string;
	token: string;
};

const temp_user: user = {
	name: 'vudiep411',
	token: 'JWTtoken'
};

const postData: any = [];
const postDetails: any = null;

export const user = writable<user>(temp_user || null);
export const data = writable(postData);
export const post = writable(postDetails);
