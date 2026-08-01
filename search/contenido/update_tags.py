import json
import re
from pathlib import Path

p = Path(__file__).parent / 'palabras-y-frases.json'
data = json.loads(p.read_text(encoding='utf-8'))

# keyword -> tags mapping (priority order)
mapping = [
    (['food','dumpling','sushi','chicken','beef','pork','egg','mango','durian','tofu','pineapple','tripe','chicken feet','bitter melon','stinky','fried','bbq','tea','pastry','chocolate','meat','fish','seafood','eggplant','bun','soup','noodles'], ['food']),
    (['dog','cat','panda','squirrel','rat','mouse','raccoon','goat','sheep','pig','horse','dragon','snake','eagle','bird','insect','crab','turtle','cow','chicken','rooster'], ['animals']),
    (['to ','to ', 'to be ', 'verb', 'marry','scold','run','running','walk','watch','make','cook','listen','drink','eat','participate','introduce','mow','clean','ride','ride bikes','ride bikes','play','swim','chat','brushing','sleeping'], ['verbs','activities']),
    (['adjective','weird','interesting','easy','hard','convenient','sketchy','fluent','warmhearted','warm heart','not very polite','not wrong','wrong'], ['adjectives']),
    (['family','uncle','aunt','mom','dad','cousin','sibling','brother','sister','parents','mother','father','son','daughter','nephew','aunt'], ['family']),
    (['currency','usd','dollar','rmb','hkd','euro','ntd','美元','美金','人民币','港币','欧元','台币'], ['currency']),
    (['grammar','particle','pronoun','who','which','where','how much','how old','don\'t','please','excuse me','what does this mean','how do you say'], ['grammar','phrases']),
    (['school','math','science','english','chinese','german','spanish','french','pe','art','classes','class','education','hsk','study'], ['education','school_classes']),
    (['time','daylight','dst','timezone','minute','time','standard time','day','hour'], ['time']),
    (['place','places','park','garden','zoo','bookstore','church','church building','backyard','library','platform','platforms','station','california','state','city'], ['places','geography']),
    (['transport','bus','public transit','taxi','uber','didi','alipay','weixin','wechat','line','tiktok','social media','platform','transportation'], ['transportation','technology']),
    (['music','punk','song','sing','concert','meme'], ['music']),
    (['culture','festival','calligraphy','ink painting','hanfu','martial arts','film','culture','film culture','wedding'], ['culture','arts']),
    (['emotion','feel','afraid','scared','happy','sad','angry','fear','warm heart'], ['emotions']),
    (['zodiac','horse','dragon','pig','dog','goat','snake','mouse','rat'], ['zodiac','animals']),
]

# helper

def infer_tags(entry):
    significado = (entry.get('significado') or '').lower()
    contenido = (entry.get('contenido') or '').lower()
    # check explicit words in meaning & content
    for keys, tags in mapping:
        for k in keys:
            if k in significado or k in contenido:
                return tags
    # short heuristics
    if re.search(r"\b(to |to be |how |where |who |what )", significado):
        return ['phrases']
    if len(entry.get('contenido','')) <= 3 and re.search(r'[\u4e00-\u9fff]', entry.get('contenido','')):
        return ['characters','language']
    return ['misc']

changed = 0
for t in data.get('textos', []):
    tags = t.get('tags', [])
    # remove 'vocabulary' entries
    new_tags = [x for x in tags if x.lower() != 'vocabulary']
    if not new_tags:
        new_tags = infer_tags(t)
    # dedupe while preserving order
    seen = set()
    dedup = []
    for x in new_tags:
        if x not in seen:
            dedup.append(x)
            seen.add(x)
    if dedup != tags:
        t['tags'] = dedup
        changed += 1

p.write_text(json.dumps(data, ensure_ascii=False, indent=4), encoding='utf-8')
print(f"Updated {changed} entries")
