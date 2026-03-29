"use client";

import { useState } from "react";
import Terminal from "@/components/terminal/Terminal";
import { type AppLocale } from "@/lib/i18n";
import { AnimatePresence, motion } from "framer-motion";

const ASCII_ART = `                  .,,,.
               ,c$$$$$$b,
             ,d$$$$$$$$$$c
            J$$$$$$$$$$$$$$c
          ,d$$$$$$$$$$$$$$$$b,               .,,,.
          $$$$$$$$$$$$$$$$$$$$c,         ,cd$$$$$$$c
         d$$$$$$$$$$$$$$$$$$$$$$$c   ,zc$$$$$$$$$$$$$
        <$$$$$$$$$$$$$$$$cc,,"""",zc$$$$$$$$$$$$$",,"$
        $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$>:! ?,
        $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$>:!!\`b
       <$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$P""?$>;!! b
        $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$F,!,",!!!,?
        $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$h\`!!;!!)">,
        ?$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ !<!! !!!
         ?$$$$$$$$$$$bccc ""??$$$$$$$$$$$$$$$L !!!;<!!;
          ?$$$$$$$$$PF"   :!>; "?$$$$$$$$$$$$$ <!!!!!((>
            "????""       ;!!!!>; "?$$$$$$$$$$ ;!!!!<!!!;.     ,;,.
                          <!!!!!!;!;,"?$$$$$$",!!!!!<!!!!;!!!\`!<!<!>
                          !!!!!!!!!)!!:."??",;'!!!!(!!!!!!!!!;!!!\`!!
                         .  ,''<!!!!!!!!:!!!)!!!!!!\`!!!!!!!!>;!!!,>!
                        J$$$b,   ,cc\`!!!!!!!!!<!!!!;)!!\`!!!(!!'!!!!!
                       ,$$$$$$$$$$$$h;;ccd$$cccc,,\`,!!!,!!('!!!!!!!'
                      ,$$$$$$$$$$$$$$$$$$$$$$$PF"",!!'>;!!;<!!!!!!'
                     ,$$$$$$$$$$$$$$$$$$$$P",;;!!!!!!!!;'!!!!!!!!'
                    ,$  ?$$$$$$$$$$$$$$"',<!!!!!!!!!!'!!!!!!!!!'
                   ,F    ?$$$$$$$$$$$" !!!!!!(!!!!!!!\`!!'!;!!'
                   dh     ,$$$$$$$P";!!\`'''\`\` \`\`\` \`\`\`\`\`\` \`
                   $$    $$$$$$$$";-\`\`
                   $F   d$$$$$$F '
                   $$cc$$$$$$$"
                   $c,",d$$$$
               .,, \`$$$$$$$P
             ,,JMMb \`$$$$$P ,dM
            '"   4M  \`???? ,nr"
       ,n,nnn,\` dMM  ,M,';MMP .,.
   ,_dMMMMMPPP  ,;-  TTT,\`)LnMMMMnnMM,.
   MMMMP",ndMMMb ,nnMMMMMbn,cccccc,"TTMMMMM
d"nMP",cc='MMM",dMMMMMMMb,"?$$$$$$$$$$c\`TMMMM
FJP,cP?"-dMMP,MMMMMMMMMP"TT $$$$$$$$$$$$c\`TMMMMn
\`",$$$$F,MMMMMMMMMMMMMM,"L"$$$$$$$$$$$$$$$c"MMMM`;

interface Props {
  locale: AppLocale;
  onLocaleChange: (locale: AppLocale) => void;
}

export default function MobileTerminalTrigger({ locale, onLocaleChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center justify-end z-50">
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[var(--terminal-primary)] hover:text-white transition-colors opacity-70 hover:opacity-100 flex items-center justify-center overflow-hidden h-[48px] w-[48px] relative shrink-0"
        aria-label="Open Terminal"
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <pre 
            className="font-mono whitespace-pre text-left text-[10px] leading-[10px]"
            style={{ transform: "scale(0.1)", transformOrigin: "center" }}
          >
            {ASCII_ART}
          </pre>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.1, x: "40%", y: "-40%" }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.1, x: "40%", y: "-40%" }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.15 }}
            style={{ transformOrigin: "top right" }}
            className="fixed inset-4 z-[100] flex flex-col drop-shadow-2xl"
          >
            <div className="flex-1 overflow-hidden relative flex flex-col pt-0 h-full w-full">
              <Terminal 
                locale={locale} 
                onLocaleChange={(next) => {
                  onLocaleChange(next);
                  setIsOpen(false);
                }} 
                floating={false} 
                onClose={() => setIsOpen(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}