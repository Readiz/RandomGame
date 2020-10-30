!function(){"use strict";function e(){}function n(e){return e()}function t(){return Object.create(null)}function a(e){e.forEach(n)}function r(e){return"function"==typeof e}function c(e,n){return e!=e?n==n:e!==n||e&&"object"==typeof e||"function"==typeof e}function l(n,t,a){n.$$.on_destroy.push(function(n,...t){if(null==n)return e;const a=n.subscribe(...t);return a.unsubscribe?()=>a.unsubscribe():a}(t,a))}function i(e,n,t=n){return e.set(t),n}function o(e,n){e.appendChild(n)}function u(e,n,t){e.insertBefore(n,t||null)}function s(e){e.parentNode.removeChild(e)}function h(e,n){for(let t=0;t<e.length;t+=1)e[t]&&e[t].d(n)}function d(e){return document.createElement(e)}function p(e){return document.createTextNode(e)}function f(){return p(" ")}function m(){return p("")}function g(e,n,t,a){return e.addEventListener(n,t,a),()=>e.removeEventListener(n,t,a)}function b(e,n,t){null==t?e.removeAttribute(n):e.getAttribute(n)!==t&&e.setAttribute(n,t)}function y(e){return""===e?null:+e}function v(e,n){n=""+n,e.wholeText!==n&&(e.data=n)}function $(e,n){e.value=null==n?"":n}function _(e,n){for(let t=0;t<e.options.length;t+=1){const a=e.options[t];if(a.__value===n)return void(a.selected=!0)}}function w(e){const n=e.querySelector(":checked")||e.options[0];return n&&n.__value}class k{constructor(e=null){this.a=e,this.e=this.n=null}m(e,n,t=null){this.e||(this.e=d(n.nodeName),this.t=n,this.h(e)),this.i(t)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)u(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(s)}}let E;function x(e){E=e}const O=[],T=[],G=[],M=[],S=Promise.resolve();let N=!1;function C(){N||(N=!0,S.then(H))}function L(){return C(),S}function A(e){G.push(e)}let D=!1;const j=new Set;function H(){if(!D){D=!0;do{for(let e=0;e<O.length;e+=1){const n=O[e];x(n),W(n.$$)}for(x(null),O.length=0;T.length;)T.pop()();for(let e=0;e<G.length;e+=1){const n=G[e];j.has(n)||(j.add(n),n())}G.length=0}while(O.length);for(;M.length;)M.pop()();N=!1,D=!1,j.clear()}}function W(e){if(null!==e.fragment){e.update(),a(e.before_update);const n=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,n),e.after_update.forEach(A)}}const I=new Set;let q;function P(){q={r:0,c:[],p:q}}function B(){q.r||a(q.c),q=q.p}function F(e,n){e&&e.i&&(I.delete(e),e.i(n))}function z(e,n,t,a){if(e&&e.o){if(I.has(e))return;I.add(e),q.c.push(()=>{I.delete(e),a&&(t&&e.d(1),a())}),e.o(n)}}function R(e,n){z(e,1,1,()=>{n.delete(e.key)})}function V(e){e&&e.c()}function J(e,t,c){const{fragment:l,on_mount:i,on_destroy:o,after_update:u}=e.$$;l&&l.m(t,c),A(()=>{const t=i.map(n).filter(r);o?o.push(...t):a(t),e.$$.on_mount=[]}),u.forEach(A)}function K(e,n){const t=e.$$;null!==t.fragment&&(a(t.on_destroy),t.fragment&&t.fragment.d(n),t.on_destroy=t.fragment=null,t.ctx=[])}function Q(n,r,c,l,i,o,u=[-1]){const h=E;x(n);const d=r.props||{},p=n.$$={fragment:null,ctx:null,props:o,update:e,not_equal:i,bound:t(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(h?h.$$.context:[]),callbacks:t(),dirty:u,skip_bound:!1};let f=!1;if(p.ctx=c?c(n,d,(e,t,...a)=>{const r=a.length?a[0]:t;return p.ctx&&i(p.ctx[e],p.ctx[e]=r)&&(!p.skip_bound&&p.bound[e]&&p.bound[e](r),f&&function(e,n){-1===e.$$.dirty[0]&&(O.push(e),C(),e.$$.dirty.fill(0)),e.$$.dirty[n/31|0]|=1<<n%31}(n,e)),t}):[],p.update(),f=!0,a(p.before_update),p.fragment=!!l&&l(p.ctx),r.target){if(r.hydrate){const e=function(e){return Array.from(e.childNodes)}(r.target);p.fragment&&p.fragment.l(e),e.forEach(s)}else p.fragment&&p.fragment.c();r.intro&&F(n.$$.fragment),J(n,r.target,r.anchor),H()}x(h)}class U{$destroy(){K(this,1),this.$destroy=e}$on(e,n){const t=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return t.push(n),()=>{const e=t.indexOf(n);-1!==e&&t.splice(e,1)}}$set(e){var n;this.$$set&&(n=e,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const X=[];function Y(n,t=e){let a;const r=[];function l(e){if(c(n,e)&&(n=e,a)){const e=!X.length;for(let e=0;e<r.length;e+=1){const t=r[e];t[1](),X.push(t,n)}if(e){for(let e=0;e<X.length;e+=2)X[e][0](X[e+1]);X.length=0}}}return{set:l,update:function(e){l(e(n))},subscribe:function(c,i=e){const o=[c,i];return r.push(o),1===r.length&&(a=t(l)||e),c(n),()=>{const e=r.indexOf(o);-1!==e&&r.splice(e,1),0===r.length&&(a(),a=null)}}}}const Z={NotStated:0,Started:1,GameOver:2},ee=Y(Z.NotStated),ne=Y(0),te=[{id:0,name:"랜덤",desc:"랜덤으로 강화를 시도할 캐릭터를 고릅니다."},{id:1,name:"흑우",desc:"보통의 무기 내구도(3회)와 보통의 강화보장(+3), 평범한 운을 가진 캐릭터"},{id:2,name:"주유",desc:"강화 보장이 높습니다(+5). 하지만 무기 내구도가 약간 낮습니다(2회)."},{id:3,name:"예리한 태성",desc:"강화 성공시 50%의 확률로 대성공 합니다(대성공시 추가로 1강 증가). 하지만 강화에 한번이라도 실패하면 게임오버(=강화 내구도 1) 입니다."},{id:4,name:"곽철용",desc:"무기 내구도가 2배(6회)입니다. 하지만 강화 보장이 0이며, 강화 확률이 기본 확률 대비 80% 입니다."},{id:5,name:"벤자민",desc:"11강에서 시작합니다. 다른캐릭터와 반대로 강화수치가 적용됩니다(성공시 감소, 대실패시 증가). 높은 강화상태일수록 성공률이 높습니다."}];function ae(e,n){return Math.floor(Math.random()*(n-e+1)+e)}function re(e){let n,t,a,r,c,l;return{c(){n=d("h6"),t=d("b"),a=p("+"),r=p(e[0]),c=f(),l=p(e[3])},m(e,i){u(e,n,i),o(n,t),o(t,a),o(t,r),o(n,c),o(n,l)},p(e,n){1&n&&v(r,e[0]),8&n&&v(l,e[3])},d(e){e&&s(n)}}}function ce(e){let n,t;return{c(){n=d("h6"),t=p(e[3])},m(e,a){u(e,n,a),o(n,t)},p(e,n){8&n&&v(t,e[3])},d(e){e&&s(n)}}}function le(n){let t,a,r,c,l,i,h;function p(e,n){return 0===e[0]?ce:re}let g=p(n),y=g(n);return{c(){t=d("div"),a=d("img"),c=f(),l=d("br"),i=f(),y.c(),h=m(),a.src!==(r=n[2])&&b(a,"src",r),b(a,"width",n[1]),b(a,"alt",n[3]),b(t,"class","svelte-1qdcimq")},m(e,n){u(e,t,n),o(t,a),u(e,c,n),u(e,l,n),u(e,i,n),y.m(e,n),u(e,h,n)},p(e,[n]){4&n&&a.src!==(r=e[2])&&b(a,"src",r),2&n&&b(a,"width",e[1]),8&n&&b(a,"alt",e[3]),g===(g=p(e))&&y?y.p(e,n):(y.d(1),y=g(e),y&&(y.c(),y.m(h.parentNode,h)))},i:e,o:e,d(e){e&&s(t),e&&s(c),e&&s(l),e&&s(i),y.d(e),e&&s(h)}}}function ie(e,n,t){let{step:a=0}=n,r=50,c="",l="";return e.$$set=e=>{"step"in e&&t(0,a=e.step)},e.$$.update=()=>{1&e.$$.dirty&&t(1,r=50+4*a),1&e.$$.dirty&&(e=>{switch(t(2,c="./"+(e<11?e:11)+".png"),e){case 0:t(3,l="단검");break;case 1:t(3,l="단도");break;case 2:t(3,l="검");break;case 3:t(3,l="시퍼런 검");break;case 4:t(3,l="용사의 검");break;case 5:t(3,l="이터널 러브");break;case 6:t(3,l="아이스 소드");break;case 7:t(3,l="에메랄드 소드");break;case 8:t(3,l="지옥의 검");break;case 9:t(3,l="레드 세이버");break;case 10:t(3,l="그린 세이버");break;case 11:case 12:case 13:case 14:case 15:case 16:case 17:case 18:case 19:case 20:t(3,l="블루 세이버")}})(a)},[a,r,c,l]}class oe extends U{constructor(e){super(),Q(this,e,ie,le,c,{step:0})}}function ue(n){let t,a,r,c;return{c(){t=d("small"),a=d("b"),a.textContent="HP",r=f(),c=p(n[0])},m(e,n){u(e,t,n),o(t,a),o(t,r),o(t,c)},p(e,[n]){1&n&&v(c,e[0])},i:e,o:e,d(e){e&&s(t)}}}function se(e,n,t){let{durability:a=3}=n,r="";return e.$$set=e=>{"durability"in e&&t(1,a=e.durability)},e.$$.update=()=>{2&e.$$.dirty&&(e=>{let n="";for(let t=0;t<e;t++)n+="■";t(0,r=n),0===e&&(n="없음")})(a)},[r,a]}class he extends U{constructor(e){super(),Q(this,e,se,ue,c,{durability:1})}}function de(e,n,t){const a=e.slice();return a[19]=n[t],a}function pe(e){let n,t,a,r,c,l,i,h,m,g=e[0].name+"";return{c(){n=d("b"),t=p(g),a=f(),r=d("br"),c=f(),l=p(e[7]),i=f(),h=d("img"),h.src!==(m="./c"+e[0].charType+".png")&&b(h,"src",m),b(h,"width","20"),b(h,"height","20"),b(h,"alt","")},m(e,s){u(e,n,s),o(n,t),u(e,a,s),u(e,r,s),u(e,c,s),u(e,l,s),u(e,i,s),u(e,h,s)},p(e,n){1&n&&g!==(g=e[0].name+"")&&v(t,g),128&n&&v(l,e[7]),1&n&&h.src!==(m="./c"+e[0].charType+".png")&&b(h,"src",m)},d(e){e&&s(n),e&&s(a),e&&s(r),e&&s(c),e&&s(l),e&&s(i),e&&s(h)}}}function fe(e){let n,t,a;return{c(){n=d("input"),b(n,"class","form-control")},m(r,c){u(r,n,c),$(n,e[0].name),t||(a=g(n,"input",e[14]),t=!0)},p(e,t){1&t&&n.value!==e[0].name&&$(n,e[0].name)},d(e){e&&s(n),t=!1,a()}}}function me(e){let n;function t(e,n){return 2==e[3]?be:ge}let a=t(e),r=a(e);return{c(){r.c(),n=m()},m(e,t){r.m(e,t),u(e,n,t)},p(e,c){a===(a=t(e))&&r?r.p(e,c):(r.d(1),r=a(e),r&&(r.c(),r.m(n.parentNode,n)))},d(e){r.d(e),e&&s(n)}}}function ge(e){let n,t,a,r,c,l;function i(e,n){return-1==e[3]?ve:ye}let o=i(e),h=o(e);return{c(){n=d("img"),a=f(),r=d("br"),c=f(),h.c(),l=m(),n.src!==(t="./c"+e[0].charType+".png")&&b(n,"src",t),b(n,"width","100"),b(n,"height","100"),b(n,"alt","")},m(e,t){u(e,n,t),u(e,a,t),u(e,r,t),u(e,c,t),h.m(e,t),u(e,l,t)},p(e,a){1&a&&n.src!==(t="./c"+e[0].charType+".png")&&b(n,"src",t),o===(o=i(e))&&h?h.p(e,a):(h.d(1),h=o(e),h&&(h.c(),h.m(l.parentNode,l)))},d(e){e&&s(n),e&&s(a),e&&s(r),e&&s(c),h.d(e),e&&s(l)}}}function be(n){let t,a,r,c,l;return{c(){t=d("img"),r=f(),c=d("br"),l=p("\n      동일랜덤"),t.src!==(a="./c0.png")&&b(t,"src","./c0.png"),b(t,"width","100"),b(t,"height","100"),b(t,"alt","")},m(e,n){u(e,t,n),u(e,r,n),u(e,c,n),u(e,l,n)},p:e,d(e){e&&s(t),e&&s(r),e&&s(c),e&&s(l)}}}function ye(e){let n,t=te[e[0].charType].name+"";return{c(){n=p(t)},m(e,t){u(e,n,t)},p(e,a){1&a&&t!==(t=te[e[0].charType].name+"")&&v(n,t)},d(e){e&&s(n)}}}function ve(e){let n,t,a,r,c=te,l=[];for(let n=0;n<c.length;n+=1)l[n]=$e(de(e,c,n));return{c(){n=d("label"),t=d("select");for(let e=0;e<l.length;e+=1)l[e].c();b(t,"class","form-control"),void 0===e[0].charType&&A(()=>e[15].call(t))},m(c,i){u(c,n,i),o(n,t);for(let e=0;e<l.length;e+=1)l[e].m(t,null);_(t,e[0].charType),a||(r=g(t,"change",e[15]),a=!0)},p(e,n){if(0&n){let a;for(c=te,a=0;a<c.length;a+=1){const r=de(e,c,a);l[a]?l[a].p(r,n):(l[a]=$e(r),l[a].c(),l[a].m(t,null))}for(;a<l.length;a+=1)l[a].d(1);l.length=c.length}1&n&&_(t,e[0].charType)},d(e){e&&s(n),h(l,e),a=!1,r()}}}function $e(n){let t,a,r,c=n[19].name+"";return{c(){t=d("option"),a=p(c),t.__value=r=n[19].id,t.value=t.__value},m(e,n){u(e,t,n),o(t,a)},p:e,d(e){e&&s(t)}}}function _e(e){let n,t,a,r,c;n=new oe({props:{step:e[0].weaponEnhance}});let l=e[2]&&e[0].gameOver&&we(),i=e[2]&&!e[0].gameOver&&ke(e);return{c(){V(n.$$.fragment),t=f(),l&&l.c(),a=f(),i&&i.c(),r=m()},m(e,o){J(n,e,o),u(e,t,o),l&&l.m(e,o),u(e,a,o),i&&i.m(e,o),u(e,r,o),c=!0},p(e,t){const c={};1&t&&(c.step=e[0].weaponEnhance),n.$set(c),e[2]&&e[0].gameOver?l||(l=we(),l.c(),l.m(a.parentNode,a)):l&&(l.d(1),l=null),e[2]&&!e[0].gameOver?i?(i.p(e,t),5&t&&F(i,1)):(i=ke(e),i.c(),F(i,1),i.m(r.parentNode,r)):i&&(P(),z(i,1,1,()=>{i=null}),B())},i(e){c||(F(n.$$.fragment,e),F(i),c=!0)},o(e){z(n.$$.fragment,e),z(i),c=!1},d(e){K(n,e),e&&s(t),l&&l.d(e),e&&s(a),i&&i.d(e),e&&s(r)}}}function we(e){let n;return{c(){n=d("br")},m(e,t){u(e,n,t)},d(e){e&&s(n)}}}function ke(e){let n,t,a,r,c,l;n=new he({props:{durability:e[0].enhanceDurability}});let i=0===e[9]&&Ee(e);return{c(){V(n.$$.fragment),t=f(),a=d("br"),r=f(),i&&i.c(),c=m()},m(e,o){J(n,e,o),u(e,t,o),u(e,a,o),u(e,r,o),i&&i.m(e,o),u(e,c,o),l=!0},p(e,t){const a={};1&t&&(a.durability=e[0].enhanceDurability),n.$set(a),0===e[9]?i?i.p(e,t):(i=Ee(e),i.c(),i.m(c.parentNode,c)):i&&(i.d(1),i=null)},i(e){l||(F(n.$$.fragment,e),l=!0)},o(e){z(n.$$.fragment,e),l=!1},d(e){K(n,e),e&&s(t),e&&s(a),e&&s(r),i&&i.d(e),e&&s(c)}}}function Ee(e){let n,t,a;function r(e,n){return e[0].enhanceWarranty>e[0].weaponEnhance||1==e[5]?Oe:xe}let c=r(e),l=c(e);return{c(){n=d("div"),l.c(),b(n,"class","btn btn-lg btn-warning svelte-9hnds1")},m(r,c){u(r,n,c),l.m(n,null),t||(a=g(n,"click",e[10]),t=!0)},p(e,t){c===(c=r(e))&&l?l.p(e,t):(l.d(1),l=c(e),l&&(l.c(),l.m(n,null)))},d(e){e&&s(n),l.d(),t=!1,a()}}}function xe(e){let n,t,a,r,c,l=Math.round(100*e[5])+"";return{c(){n=d("small"),t=d("b"),t.textContent="강화!",a=p(" 확률: "),r=p(l),c=p("%"),b(n,"class","svelte-9hnds1")},m(e,l){u(e,n,l),o(n,t),o(n,a),o(n,r),o(n,c)},p(e,n){32&n&&l!==(l=Math.round(100*e[5])+"")&&v(r,l)},d(e){e&&s(n)}}}function Oe(n){let t;return{c(){t=d("small"),t.innerHTML="<b>강화!</b> 보장 구간",b(t,"class","svelte-9hnds1")},m(e,n){u(e,t,n)},p:e,d(e){e&&s(t)}}}function Te(e){let n,t,a,r,c,l;function i(e,n){return e[2]?pe:fe}let h=i(e),p=h(e),m=!e[2]&&me(e),g=e[2]&&_e(e);return{c(){n=d("div"),p.c(),t=f(),m&&m.c(),a=f(),g&&g.c(),b(n,"class","playerContainer svelte-9hnds1"),b(n,"highlight",e[4]),b(n,"recentstate",e[6]),b(n,"isallgameovered",r=e[1]&&e[2]),b(n,"isautoplaying",c=e[9]>0&&e[2]&&!e[0].gameOver)},m(r,c){u(r,n,c),p.m(n,null),o(n,t),m&&m.m(n,null),o(n,a),g&&g.m(n,null),e[16](n),l=!0},p(e,[o]){h===(h=i(e))&&p?p.p(e,o):(p.d(1),p=h(e),p&&(p.c(),p.m(n,t))),e[2]?m&&(m.d(1),m=null):m?m.p(e,o):(m=me(e),m.c(),m.m(n,a)),e[2]?g?(g.p(e,o),4&o&&F(g,1)):(g=_e(e),g.c(),F(g,1),g.m(n,null)):g&&(P(),z(g,1,1,()=>{g=null}),B()),(!l||16&o)&&b(n,"highlight",e[4]),(!l||64&o)&&b(n,"recentstate",e[6]),(!l||6&o&&r!==(r=e[1]&&e[2]))&&b(n,"isallgameovered",r),(!l||517&o&&c!==(c=e[9]>0&&e[2]&&!e[0].gameOver))&&b(n,"isautoplaying",c)},i(e){l||(F(g),l=!0)},o(e){z(g),l=!1},d(t){t&&s(n),p.d(),m&&m.d(),g&&g.d(),e[16](null)}}}function Ge(e,n,t){let a;l(e,ne,e=>t(9,a=e));let{playerInfo:r={uid:0,id:0,name:"",charType:0,enhanceDurability:3,enhanceWarranty:3,weaponEnhance:0,highlight:!1,gameOver:!1}}=n,c=!1,{GameLog:i=[]}=n,{isAllGameOvered:o=!1}=n,{handleGameOver:u=(()=>{})}=n,{isGameStarted:s=!1}=n,{gameMode:h=-1}=n,{forceChar:d=0}=n,p=1;const f="Failed",m="BigFailed",g="Success",b="BigSuccess";let y,v="NothingHappened",$="";function _(){r.gameOver||(r.weaponEnhance<r.enhanceWarranty||ae(1,100)<=100*p?(r.weaponEnhance<r.enhanceWarranty?i.push(r.name+", 강화 보장 구간이기 때문에 강화에 성공 하였습니다! 강화도 +1!"):i.push(`${r.name}, ${Math.round(100*p)}%의 확률을 뚫고 강화에 성공 하였습니다! 강화도 +1!`),3===r.charType&&ae(1,100)<=50?(t(6,v=b),t(0,r.weaponEnhance+=2,r),i.push("   - 예리한 태성은 예리한 기운을 받아 성공을 대성공으로 만들었습니다! 강화도 +1 추가!")):5===r.charType?(t(6,v=g),t(0,r.weaponEnhance--,r),r.weaponEnhance<0&&t(0,r.weaponEnhance=0,r),i.push("   - 일 줄 알았지만, 벤자민의 강화는 거꾸로 갑니다! 강화도는 증가하지 않고 감소됩니다! 강화도 -1!")):(t(6,v=g),t(0,r.weaponEnhance++,r)),i.push("   - 무기 강화도: +"+r.weaponEnhance)):(t(0,r.enhanceDurability-=1,r),i.push(`${r.name}, ${Math.round(100*p)}%의 확률을 뚫지 못하여 강화에 실패 하였습니다..`),ae(1,100)<=50&&r.weaponEnhance>0?(t(6,v=m),i.push("   - 손이 미끄러져서 강화에 대실패 하였습니다! 강화도 -1!"),5===r.charType?(t(0,r.weaponEnhance+=1,r),i.push("   - 일 줄 알았지만, 벤자민의 강화는 거꾸로 갑니다! 강화도는 감소되지 않고 증가합니다! 강화도 +1!")):(t(0,r.weaponEnhance-=1,r),r.weaponEnhance<0&&t(0,r.weaponEnhance=0,r)),0!==r.enhanceDurability&&i.push("   - 무기 강화도: +"+r.weaponEnhance)):t(6,v=f),0===r.enhanceDurability?(t(0,r.gameOver=!0,r),i.push("   - 내구도가 모두 소모되어 Game Over!"),i.push("   - 최종 달성 무기 강화도: +"+r.weaponEnhance)):i.push("   - 남은 무기 내구도: "+r.enhanceDurability)),r.weaponEnhance<10?(t(5,p=1-.1*(r.weaponEnhance-2)),p>1&&t(5,p=1)):t(5,p=.01),4===r.charType?t(5,p*=.8):5===r.charType&&(t(5,p=1-.1*(11-r.weaponEnhance)),p>1&&t(5,p=1),p<.1&&t(5,p=.1)))}return ee.subscribe(e=>{e===Z.Started&&function(){0===r.charType&&t(0,r.charType=ae(1,te.length-1),r);2===r.charType&&(t(0,r.enhanceDurability=2,r),t(0,r.enhanceWarranty=5,r));3===r.charType&&t(0,r.enhanceDurability=1,r);4===r.charType&&(t(0,r.enhanceDurability=6,r),t(0,r.enhanceWarranty=0,r),t(5,p=.8));5===r.charType&&(t(0,r.weaponEnhance=11,r),t(0,r.enhanceDurability=3,r),t(0,r.enhanceWarranty=0,r),t(5,p=1));i.push(`${r.name}의 캐릭터는 ${te[r.charType].name}입니다.`)}()}),ne.subscribe(e=>{s&&e>0&&_(),r.gameOver?t(4,c=r.highlight):t(4,c=!1)}),e.$$set=e=>{"playerInfo"in e&&t(0,r=e.playerInfo),"GameLog"in e&&t(11,i=e.GameLog),"isAllGameOvered"in e&&t(1,o=e.isAllGameOvered),"handleGameOver"in e&&t(12,u=e.handleGameOver),"isGameStarted"in e&&t(2,s=e.isGameStarted),"gameMode"in e&&t(3,h=e.gameMode),"forceChar"in e&&t(13,d=e.forceChar)},e.$$.update=()=>{8200&e.$$.dirty&&(0===h?t(0,r.charType=0,r):1!==h&&2!==h||t(0,r.charType=d,r)),1&e.$$.dirty&&t(7,$=te[r.charType].name),4097&e.$$.dirty&&r.gameOver&&u()},[r,o,s,h,c,p,v,$,y,a,_,i,u,d,function(){r.name=this.value,t(0,r),t(3,h),t(13,d)},function(){r.charType=w(this),t(0,r),t(3,h),t(13,d)},function(e){T[e?"unshift":"push"](()=>{y=e,t(8,y)})}]}class Me extends U{constructor(e){super(),Q(this,e,Ge,Te,c,{playerInfo:0,GameLog:11,isAllGameOvered:1,handleGameOver:12,isGameStarted:2,gameMode:3,forceChar:13})}}function Se(e,n,t){const a=e.slice();return a[32]=n[t],a}function Ne(e,n,t){const a=e.slice();return a[35]=n[t],a}function Ce(e,n,t){const a=e.slice();return a[38]=n[t],a}function Le(e){let n,t,r,c,l,i,h,m,v,_,w,k,E,x,O,T,G,M,S,N,C,L,A,D,j,H,W,I,q,P,B,F,z,R,V,J,K,Q,U,X,Y,Z,ee,ne,te,ae,re,ce,le,ie=1==e[9]&&Ae(e);return{c(){var a,o,u;n=d("h1"),n.textContent="운빨망겜",t=f(),r=d("p"),r.innerHTML="당신의 운을 시험해서 승자가 되세요.<br/>\n무기를 강화해 내기에서 승리하세요!",c=f(),l=d("label"),i=p("게임 인원 수:\r\n\t"),h=d("input"),m=f(),v=d("input"),_=f(),w=d("br"),k=p("\r\n\r\n내기 등수:\r\n"),E=d("label"),x=d("input"),T=p("\r\n  1등"),G=f(),M=d("label"),S=d("input"),C=p("\r\n  꼴등"),L=f(),A=d("br"),D=p("\r\n\r\n게임 모드:\r\n"),j=d("label"),H=d("input"),I=p("\r\n  동일랜덤"),q=f(),P=d("label"),B=d("input"),z=p("\r\n  올랜덤"),R=f(),V=d("label"),J=d("input"),Q=p("\r\n  개인선택"),U=f(),X=d("label"),Y=d("input"),ee=p("\r\n  동캐전\r\n  "),ie&&ie.c(),ne=f(),te=d("br"),ae=f(),re=d("div"),re.innerHTML="<h5>게임 시작!</h5>",b(h,"type","number"),b(h,"min","1"),b(h,"max","30"),b(v,"type","range"),b(v,"min","1"),b(v,"max","30"),a="width",o="250px",v.style.setProperty(a,o,u?"important":""),b(x,"type","radio"),x.__value=O=1,x.value=x.__value,e[19][0].push(x),b(S,"type","radio"),S.__value=N=9999,S.value=S.__value,e[19][0].push(S),b(H,"type","radio"),H.__value=W=2,H.value=H.__value,e[19][1].push(H),b(B,"type","radio"),B.__value=F=0,B.value=B.__value,e[19][1].push(B),b(J,"type","radio"),J.__value=K=-1,J.value=J.__value,e[19][1].push(J),b(Y,"type","radio"),Y.__value=Z=1,Y.value=Y.__value,e[19][1].push(Y),b(re,"class","btn btn-md btn-primary")},m(a,s){u(a,n,s),u(a,t,s),u(a,r,s),u(a,c,s),u(a,l,s),o(l,i),o(l,h),$(h,e[4]),o(l,m),o(l,v),$(v,e[4]),u(a,_,s),u(a,w,s),u(a,k,s),u(a,E,s),o(E,x),x.checked=x.__value===e[6],o(E,T),u(a,G,s),u(a,M,s),o(M,S),S.checked=S.__value===e[6],o(M,C),u(a,L,s),u(a,A,s),u(a,D,s),u(a,j,s),o(j,H),H.checked=H.__value===e[9],o(j,I),u(a,q,s),u(a,P,s),o(P,B),B.checked=B.__value===e[9],o(P,z),u(a,R,s),u(a,V,s),o(V,J),J.checked=J.__value===e[9],o(V,Q),u(a,U,s),u(a,X,s),o(X,Y),Y.checked=Y.__value===e[9],o(X,ee),ie&&ie.m(X,null),u(a,ne,s),u(a,te,s),u(a,ae,s),u(a,re,s),ce||(le=[g(h,"input",e[16]),g(v,"change",e[17]),g(v,"input",e[17]),g(x,"change",e[18]),g(S,"change",e[20]),g(H,"change",e[21]),g(B,"change",e[22]),g(J,"change",e[23]),g(Y,"change",e[24]),g(re,"click",e[26])],ce=!0)},p(e,n){16&n[0]&&y(h.value)!==e[4]&&$(h,e[4]),16&n[0]&&$(v,e[4]),64&n[0]&&(x.checked=x.__value===e[6]),64&n[0]&&(S.checked=S.__value===e[6]),512&n[0]&&(H.checked=H.__value===e[9]),512&n[0]&&(B.checked=B.__value===e[9]),512&n[0]&&(J.checked=J.__value===e[9]),512&n[0]&&(Y.checked=Y.__value===e[9]),1==e[9]?ie?ie.p(e,n):(ie=Ae(e),ie.c(),ie.m(X,null)):ie&&(ie.d(1),ie=null)},d(i){i&&s(n),i&&s(t),i&&s(r),i&&s(c),i&&s(l),i&&s(_),i&&s(w),i&&s(k),i&&s(E),e[19][0].splice(e[19][0].indexOf(x),1),i&&s(G),i&&s(M),e[19][0].splice(e[19][0].indexOf(S),1),i&&s(L),i&&s(A),i&&s(D),i&&s(j),e[19][1].splice(e[19][1].indexOf(H),1),i&&s(q),i&&s(P),e[19][1].splice(e[19][1].indexOf(B),1),i&&s(R),i&&s(V),e[19][1].splice(e[19][1].indexOf(J),1),i&&s(U),i&&s(X),e[19][1].splice(e[19][1].indexOf(Y),1),ie&&ie.d(),i&&s(ne),i&&s(te),i&&s(ae),i&&s(re),ce=!1,a(le)}}}function Ae(e){let n,t,a,r=te,c=[];for(let n=0;n<r.length;n+=1)c[n]=De(Ce(e,r,n));return{c(){n=d("select");for(let e=0;e<c.length;e+=1)c[e].c();void 0===e[10]&&A(()=>e[25].call(n))},m(r,l){u(r,n,l);for(let e=0;e<c.length;e+=1)c[e].m(n,null);_(n,e[10]),t||(a=g(n,"change",e[25]),t=!0)},p(e,t){if(0&t){let a;for(r=te,a=0;a<r.length;a+=1){const l=Ce(e,r,a);c[a]?c[a].p(l,t):(c[a]=De(l),c[a].c(),c[a].m(n,null))}for(;a<c.length;a+=1)c[a].d(1);c.length=r.length}1024&t[0]&&_(n,e[10])},d(e){e&&s(n),h(c,e),t=!1,a()}}}function De(n){let t,a=0!=n[38].id&&function(n){let t,a,r,c=n[38].name+"";return{c(){t=d("option"),a=p(c),t.__value=r=n[38].id,t.value=t.__value},m(e,n){u(e,t,n),o(t,a)},p:e,d(e){e&&s(t)}}}(n);return{c(){a&&a.c(),t=m()},m(e,n){a&&a.m(e,n),u(e,t,n)},p(e,n){0!=e[38].id&&a.p(e,n)},d(e){a&&a.d(e),e&&s(t)}}}function je(e){let n,t,a,r,c,l,i;function o(e,n){return e[3]?We:He}let h=o(e),p=h(e);return{c(){t=f(),a=d("br"),r=d("br"),c=f(),p.c(),l=f(),i=d("hr"),n=new k(t)},m(o,s){n.m(e[7],o,s),u(o,t,s),u(o,a,s),u(o,r,s),u(o,c,s),p.m(o,s),u(o,l,s),u(o,i,s)},p(e,t){128&t[0]&&n.p(e[7]),h===(h=o(e))&&p?p.p(e,t):(p.d(1),p=h(e),p&&(p.c(),p.m(l.parentNode,l)))},d(e){e&&n.d(),e&&s(t),e&&s(a),e&&s(r),e&&s(c),p.d(e),e&&s(l),e&&s(i)}}}function He(n){let t,a,r;return{c(){t=d("div"),t.textContent="게임 재시작",b(t,"class","btn btn-md btn-danger")},m(e,c){u(e,t,c),a||(r=g(t,"click",n[28]),a=!0)},p:e,d(e){e&&s(t),a=!1,r()}}}function We(n){let t,a,r;return{c(){t=d("div"),t.innerHTML="<h2>동점자 리매치</h2>\n  동점자들끼리 내구도 1로 현재 상태에서 강화를 추가로 시도합니다.",b(t,"class","btn btn-md btn-primary")},m(e,c){u(e,t,c),a||(r=g(t,"click",n[27]),a=!0)},p:e,d(e){e&&s(t),a=!1,r()}}}function Ie(n){let t,a,r,c,l;return{c(){t=d("div"),t.textContent="자동 진행",a=f(),r=d("hr"),b(t,"class","btn btn-lg btn-info")},m(e,i){u(e,t,i),u(e,a,i),u(e,r,i),c||(l=g(t,"click",n[29]),c=!0)},p:e,d(e){e&&s(t),e&&s(a),e&&s(r),c=!1,l()}}}function qe(e,n){let t,a,r;return a=new Me({props:{playerInfo:n[35],isGameStarted:n[1],handleGameOver:n[15],gameMode:n[9],forceChar:n[10],isAllGameOvered:n[2],GameLog:n[0]}}),{key:e,first:null,c(){t=m(),V(a.$$.fragment),this.first=t},m(e,n){u(e,t,n),J(a,e,n),r=!0},p(e,n){const t={};256&n[0]&&(t.playerInfo=e[35]),2&n[0]&&(t.isGameStarted=e[1]),512&n[0]&&(t.gameMode=e[9]),1024&n[0]&&(t.forceChar=e[10]),4&n[0]&&(t.isAllGameOvered=e[2]),1&n[0]&&(t.GameLog=e[0]),a.$set(t)},i(e){r||(F(a.$$.fragment,e),r=!0)},o(e){z(a.$$.fragment,e),r=!1},d(e){e&&s(t),K(a,e)}}}function Pe(e){let n,t,a=e[0].join("\n")+"";return{c(){n=d("pre"),t=p(a)},m(e,a){u(e,n,a),o(n,t)},p(e,n){1&n[0]&&a!==(a=e[0].join("\n")+"")&&v(t,a)},d(e){e&&s(n)}}}function Be(e){let n,t,a,r,c,l,i,o,m,g,b,y,v,$,_,w,k,E,x=te,O=[];for(let n=0;n<x.length;n+=1)O[n]=Fe(Se(e,x,n));return{c(){n=d("h3"),n.textContent="튜토리얼",t=f(),a=d("ol"),a.innerHTML="<li>게임이 사직되면, 각 플레이어는 각 플레이어의 특성에 맞는 스탯을 부여 받습니다.</li> \n  <li>무기 강화를 시도하게 되면, 강화도가 1 상승하거나(성공), 유지되거나(실패), 하락할 수 있습니다(대실패).</li> \n  <li>각 플레이어는 무기의 내구도가 모두 소모될 때까지 강화를 계속 시도 해야 합니다.</li> \n  <li>모든 플레이어의 강화가 끝나면(=모든 플레이어의 무기 내구도가 모두 소모되면), 게임 시작시 설정한 순위의 사람이 당첨됩니다.</li> \n  <li>순위는 무기 강화도가 높은 사람이 높습니다. 만약 동점자가 있다면 동점자끼리 간이 재경기가 시작됩니다.</li> \n  <li>재경기 시에는 재경기에 돌입하는 사람들이 내구도 1을 추가로 받아 번외 경기가 시작됩니다.</li> \n  <li>게임이 시작되면 자동진행이 가능합니다. 자동진행시 모든 플레이어의 강화가 끝날 때까지 강화가 계속 시도 됩니다.</li>",r=f(),c=d("h4"),c.textContent="캐릭터 특성 설명",l=f(),i=d("ul");for(let e=0;e<O.length;e+=1)O[e].c();o=f(),m=d("b"),m.textContent="Ver.",g=p(" 2020/10/29"),b=d("br"),y=f(),v=d("b"),v.textContent="Made by",$=p(" Readiz"),_=d("br"),w=f(),k=d("b"),k.textContent="Special Thanks to",E=p(" HG")},m(e,s){u(e,n,s),u(e,t,s),u(e,a,s),u(e,r,s),u(e,c,s),u(e,l,s),u(e,i,s);for(let e=0;e<O.length;e+=1)O[e].m(i,null);u(e,o,s),u(e,m,s),u(e,g,s),u(e,b,s),u(e,y,s),u(e,v,s),u(e,$,s),u(e,_,s),u(e,w,s),u(e,k,s),u(e,E,s)},p(e,n){if(0&n){let t;for(x=te,t=0;t<x.length;t+=1){const a=Se(e,x,t);O[t]?O[t].p(a,n):(O[t]=Fe(a),O[t].c(),O[t].m(i,null))}for(;t<O.length;t+=1)O[t].d(1);O.length=x.length}},d(e){e&&s(n),e&&s(t),e&&s(a),e&&s(r),e&&s(c),e&&s(l),e&&s(i),h(O,e),e&&s(o),e&&s(m),e&&s(g),e&&s(b),e&&s(y),e&&s(v),e&&s($),e&&s(_),e&&s(w),e&&s(k),e&&s(E)}}}function Fe(n){let t,a,r,c,l=n[32].name+"",i=n[32].desc+"";return{c(){t=d("li"),a=p(l),r=p(": "),c=p(i)},m(e,n){u(e,t,n),o(t,a),o(t,r),o(t,c)},p:e,d(e){e&&s(t)}}}function ze(e){let n,t,a,r,c,l,i,h,p,g,y,v,$=[],_=new Map,w=!e[1]&&Le(e),k=e[2]&&je(e),E=e[1]&&!e[2]&&!e[11]&&Ie(e),x=e[8];const O=e=>e[35].uid;for(let n=0;n<x.length;n+=1){let t=Ne(e,x,n),a=O(t);_.set(a,$[n]=qe(a,t))}let T=e[1]&&Pe(e),G=!e[1]&&Be(e);return{c(){w&&w.c(),n=f(),t=d("div"),k&&k.c(),a=f(),E&&E.c(),r=f(),c=d("div");for(let e=0;e<$.length;e+=1)$[e].c();l=f(),T&&T.c(),i=f(),h=d("br"),p=d("br"),g=f(),G&&G.c(),y=m(),b(t,"class","resultArea svelte-hbj03k"),b(c,"class","cardArea svelte-hbj03k")},m(e,s){w&&w.m(e,s),u(e,n,s),u(e,t,s),k&&k.m(t,null),o(t,a),E&&E.m(t,null),u(e,r,s),u(e,c,s);for(let e=0;e<$.length;e+=1)$[e].m(c,null);u(e,l,s),T&&T.m(e,s),u(e,i,s),u(e,h,s),u(e,p,s),u(e,g,s),G&&G.m(e,s),u(e,y,s),v=!0},p(e,r){if(e[1]?w&&(w.d(1),w=null):w?w.p(e,r):(w=Le(e),w.c(),w.m(n.parentNode,n)),e[2]?k?k.p(e,r):(k=je(e),k.c(),k.m(t,a)):k&&(k.d(1),k=null),!e[1]||e[2]||e[11]?E&&(E.d(1),E=null):E?E.p(e,r):(E=Ie(e),E.c(),E.m(t,null)),34567&r[0]){const n=e[8];P(),$=function(e,n,t,a,r,c,l,i,o,u,s,h){let d=e.length,p=c.length,f=d;const m={};for(;f--;)m[e[f].key]=f;const g=[],b=new Map,y=new Map;for(f=p;f--;){const e=h(r,c,f),i=t(e);let o=l.get(i);o?a&&o.p(e,n):(o=u(i,e),o.c()),b.set(i,g[f]=o),i in m&&y.set(i,Math.abs(f-m[i]))}const v=new Set,$=new Set;function _(e){F(e,1),e.m(i,s),l.set(e.key,e),s=e.first,p--}for(;d&&p;){const n=g[p-1],t=e[d-1],a=n.key,r=t.key;n===t?(s=n.first,d--,p--):b.has(r)?!l.has(a)||v.has(a)?_(n):$.has(r)?d--:y.get(a)>y.get(r)?($.add(a),_(n)):(v.add(r),d--):(o(t,l),d--)}for(;d--;){const n=e[d];b.has(n.key)||o(n,l)}for(;p;)_(g[p-1]);return g}($,r,O,1,e,n,_,c,R,qe,null,Ne),B()}e[1]?T?T.p(e,r):(T=Pe(e),T.c(),T.m(i.parentNode,i)):T&&(T.d(1),T=null),e[1]?G&&(G.d(1),G=null):G?G.p(e,r):(G=Be(e),G.c(),G.m(y.parentNode,y))},i(e){if(!v){for(let e=0;e<x.length;e+=1)F($[e]);v=!0}},o(e){for(let e=0;e<$.length;e+=1)z($[e]);v=!1},d(e){w&&w.d(e),e&&s(n),e&&s(t),k&&k.d(),E&&E.d(),e&&s(r),e&&s(c);for(let e=0;e<$.length;e+=1)$[e].d();e&&s(l),T&&T.d(e),e&&s(i),e&&s(h),e&&s(p),e&&s(g),G&&G.d(e),e&&s(y)}}}function Re(e,n){return e.weaponEnhance>n.weaponEnhance?-1:e.weaponEnhance<n.weaponEnhance?1:0}function Ve(e){return new Promise(n=>setTimeout(n,e))}function Je(e,n,t){let a,r;l(e,ne,e=>t(11,a=e)),l(e,ee,e=>t(12,r=e));let c=[],o=!1,u=!1,s=!1,h=4,d=[],p=9999,f=0,m="",g=[],b=2,v=1;function $(e){2===e&&t(10,v=ae(1,te.length-1))}function _(e){t(8,g=[]);for(let n=0;n<e;n++)g.push({uid:f,id:n+1,name:"플레이어 #"+(n+1),charType:0,enhanceDurability:3,enhanceWarranty:3,weaponEnhance:0,highlight:!1,gameOver:!1}),f++}function k(e){for(const e of g)e.highlight=!1;for(let n of e)n.highlight=!0;i(ne,a++,a)}return e.$$.update=()=>{16&e.$$.dirty[0]&&_(h),512&e.$$.dirty[0]&&$(b)},[c,o,u,s,h,d,p,m,g,b,v,a,r,$,_,function(){let e=!0;for(const n of g)!1===n.gameOver&&(e=!1);if(e&&!u){t(2,u=!0);let e=99999,n=-1,a=-1;t(5,d=[]);let r=[];t(7,m="");const l=[...g].sort(Re);n=l[0].weaponEnhance,a=l[l.length-1].weaponEnhance;for(const t of l)e>t.weaponEnhance&&(e=t.weaponEnhance),1===p?t.weaponEnhance===n&&(d.push(t),r.push(t.name)):9999===p&&t.weaponEnhance===a&&(d.push(t),r.push(t.name));c.push("------------------------------------------"),1===d.length?(k([d[0]]),t(7,m+=`<h4>${d[0].name} 님, ${1===p?"1":"꼴"}등 축하드립니다.</h4>`),t(7,m+=`<b>달성한 강화도: ${d[0].weaponEnhance}</b><br>`),t(7,m+="기분 좋은 마음으로 커피를 쏘면 어떨까요?"),c.push(`게임 종료! ${d[0].name} 님, ${1===p?"1":"꼴"}등 축하드립니다.`),c.push("달성한 강화도: "+d[0].weaponEnhance),c.push("기분 좋은 마음으로 커피를 쏘면 어떨까요?")):(k(d),t(7,m+=`<h4>${1===p?"1":"꼴"}등에 대한 동점자가 나왔군요!</h4><b>대상자: `+r.join(" 님, ")+" 님.</b><br>"),t(7,m+=`<b>달성한 강화도: ${d[0].weaponEnhance}</b><br>`),t(7,m+="동점자끼리 재경기를 원하시면 아래 버튼을 눌러주세요."),t(3,s=!0),c.push(`게임 종료! ${1===p?"1":"꼴"}등에 대한 동점자가 나왔습니다. ${r.join(" 님, ")}  님.`),c.push("달성한 강화도: "+d[0].weaponEnhance)),t(0,c)}},function(){h=y(this.value),t(4,h)},function(){h=y(this.value),t(4,h)},function(){p=this.__value,t(6,p)},[[],[]],function(){p=this.__value,t(6,p)},function(){b=this.__value,t(9,b)},function(){b=this.__value,t(9,b)},function(){b=this.__value,t(9,b)},function(){b=this.__value,t(9,b)},function(){v=w(this),t(10,v)},()=>{(async()=>{t(0,c=[]),c.push("게임이 시작되었습니다."),await L(),t(1,o=!0),i(ee,r=Z.Started,r)})()},()=>{(async()=>{t(2,u=!1),t(1,o=!0),t(3,s=!1),t(5,d=d.map(e=>(e.enhanceDurability+=1,e.highlight=!1,e.gameOver=!1,e))),i(ee,r=Z.NotStarted,r),i(ne,a=0,a),t(8,g=d),await L(),t(0,c=[]),c.push("동점자 리매치가 시작되었습니다."),t(0,c)})()},()=>{t(2,u=!1),t(1,o=!1),t(3,s=!1),i(ee,r=Z.NotStarted,r),i(ne,a=0,a),t(0,c=[]),_(h),$(b)},()=>{(async()=>{for(;!u;)c.push(`------------ 자동진행 턴 #${a+1} ------------`),t(0,c),i(ne,a+=1,a),await L(),await Ve(1e3)})()}]}new class extends U{constructor(e){super(),Q(this,e,Je,ze,c,{},[-1,-1])}}({target:document.body})}();
//# sourceMappingURL=index.js.map
