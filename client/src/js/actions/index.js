import { SEND_BODY } from "../constants/action-types";

import { ADD_CARS } from "../constants/action-types";

import { ADD_TAGS } from "../constants/action-types";

import { SEND_CMP_CARS } from "../constants/action-types";

export function addSearchBody(payload) {
    return { type: SEND_BODY, payload }
};


export function addCars(payload) {
    return { type: ADD_CARS, payload }
};


export function addTags(payload) {
    return { type: ADD_TAGS, payload }
};

export function addCmpCars(payload) {
    return { type: SEND_CMP_CARS, payload }
}