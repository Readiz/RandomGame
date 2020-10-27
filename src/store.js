import { writable } from 'svelte/store';

export const GameLifeCycle = {
    NotStated: 0,
    Started: 1,
    GameOver: 2
}
export const GameState = writable(GameLifeCycle.NotStated);
export const GameAutoProcess = writable(0);
export const CharTypes = [
    { id: 0, name: '랜덤', desc: '랜덤으로 강화를 시도할 캐릭터를 고릅니다.' },
    { id: 1, name: '흑우', desc: '보통의 무기 내구도(3회)와 평범한 운을 가진 캐릭터' },
    { id: 2, name: '주유', desc: '강화 확률이 절반 입니다. 하지만 기본 강화 보장이 높습니다(+5).' },
    { id: 3, name: '예리한 태성', desc: '강화시 1%의 확률로 최대 강화에 도달합니다. 하지만 강화에 한번이라도 실패하면 게임오버 입니다.' },
    { id: 4, name: '곽철용', desc: '무기 내구도가 2배(6회)입니다. 하지만 기본 강화 보장이 0이며, 강화 확률이 약간 낮습니다.' },
];