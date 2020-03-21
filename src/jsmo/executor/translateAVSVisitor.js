import {Visitor} from "../visitor/visitor";

export class translateAVSVisitor extends Visitor {
// the format is already in right cases, don't need to check again.
    constructor(avs) {
        super();
        if (avs) {
            this.avs = avs;
        }
    }


    visitSay(say) {
        //translate to text.show("");
        if (typeof say['name'] !== "undefined") {
            say['avs'] = `text.show("${say.content}",{ name: "${say['name']}" });`
        } else {
            say['avs'] = `text.show("${say.content}");`
        }
    }

    visitText(text) {
        text.content = this.parseVariable(text.content)
    }

    visitText_off(text_off) {

    }

    visitWaitkey(waitkey) {

    }

    visitTitle(title) {
        slope.variables['title'] = title.content;
    }

    visitTitle_dsp(title_dsp) {

    }

    visitChara(chara) {

    }

    visitChara_cls(chara_cls) {

    }

    visitChara_pos(chara_pos) {

    }

    visitBg(bg) {

    }

    visitFlash(flash) {

    }

    visitQuake(quake) {

    }

    visitFade_out(fade_out) {

    }

    visitFade_in(fade_in) {

    }

    visitMovie(movie) {

    }

    visitTextbox(textbox) {

    }

    visitChara_quake(chara_quake) {

    }

    visitChara_down(chara_down) {

    }

    visitChara_up(chara_up) {

    }

    visitScroll(scroll) {

    }

    visitChara_y(chara_y) {

    }

    visitChara_scroll(chara_scroll) {

    }

    visitAnime_on(anime_on) {

    }

    visitAnime_off(anime_off) {

    }

    visitChara_anime(chara_anime) {

    }

    visitSet(set) {

    }

    visitAdd(add) {

    }

    visitSub(sub) {

    }

    visitLabel(label) {

    }

    visitGoto(goto) {

    }

    visitIf___goto(if___goto) {

    }

    visitChange(change) {

    }

    visitCall(call) {

    }

    visitRet(ret) {

    }

    visitSel(sel) {

    }

    visitSelect_text(select_text) {

    }

    visitSelect_var(select_var) {

    }

    visitSelect_img(select_img) {

    }

    visitSelect_imgs(select_imgs) {

    }

    visitWait(wait) {

    }

    visitWait_se(wait_se) {

    }

    visitRand(rand) {

    }

    visitBgm(bgm) {

    }

    visitBgm_stop(bgm_stop) {

    }

    visitSe(se) {

    }

    visitSe_stop(se_stop) {

    }

    visitVo(vo) {

    }

    visitLoad(load) {

    }

    visitAlbum(album) {

    }

    visitMusic(music) {

    }

    visitDate(date) {

    }

    visitConfig(config) {

    }
}
