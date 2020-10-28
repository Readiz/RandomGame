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
    { id: 1, name: '흑우', desc: '보통의 무기 내구도(3회)와 보통의 강화보장(+3), 평범한 운을 가진 캐릭터' },
    { id: 2, name: '주유', desc: '강화 확률이 절반 입니다. 하지만 강화 보장이 높습니다(+5).' },
    { id: 3, name: '예리한 태성', desc: '강화 성공시 50%의 확률로 대성공 합니다(대성공시 추가로 1강 증가). 하지만 강화에 한번이라도 실패하면 게임오버(=강화 내구도 1) 입니다.' },
    { id: 4, name: '곽철용', desc: '무기 내구도가 2배(6회)입니다. 하지만 강화 보장이 0이며, 강화 확률이 기본 확률 대비 80% 입니다.' },
    { id: 5, name: '벤자민', desc: '11강에서 시작합니다. 다른캐릭터와 반대로 강화수치가 적용됩니다(성공시 감소, 대실패시 증가). 높은 강화상태일수록 성공률이 높습니다.'}
];