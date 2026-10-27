import { useConfig } from '../../config/store'
import { safeImageUrl, uid } from '../../lib/format'
import {
  AddButton,
  Field,
  Grid,
  IconPicker,
  ItemCard,
  Section,
  TextArea,
  TextInput,
  Toggle,
} from './fields'

/* ══════════════════════ 流程 ══════════════════════ */

export function HowEditor() {
  const { config, set, resetSection } = useConfig()
  const copy = config.howCopy

  return (
    <div className="pt-1">
      <Section title="区块文案" defaultOpen onReset={() => resetSection('howCopy')}>
        <div className="grid gap-2.5">
          <Field label="小标签">
            <TextInput value={copy.eyebrow} onChange={(v) => set('howCopy.eyebrow', v)} />
          </Field>
          <Field label="标题">
            <TextInput value={copy.title} onChange={(v) => set('howCopy.title', v)} />
          </Field>
          <Field label="右侧说明">
            <TextArea value={copy.sub} onChange={(v) => set('howCopy.sub', v)} rows={2} />
          </Field>
        </div>
      </Section>

      <Section title="三个步骤" defaultOpen onReset={() => resetSection('steps')}>
        <div className="grid gap-2">
          {config.steps.map((s, i) => (
            <ItemCard
              key={s.id}
              index={i}
              title={s.title}
              canRemove={config.steps.length > 1}
              onRemove={() => set('steps', config.steps.filter((x) => x.id !== s.id))}
            >
              <Field label="图标">
                <IconPicker value={s.icon} onChange={(v) => set(`steps.${i}.icon`, v)} />
              </Field>
              <Field label="标题">
                <TextInput value={s.title} onChange={(v) => set(`steps.${i}.title`, v)} />
              </Field>
              <Field label="说明">
                <TextArea value={s.body} onChange={(v) => set(`steps.${i}.body`, v)} rows={2} />
              </Field>
            </ItemCard>
          ))}
          <AddButton
            onClick={() =>
              set('steps', [
                ...config.steps,
                { id: uid('step'), icon: 'zap', title: '新步骤', body: '一句话说明。' },
              ])
            }
            label="添加步骤"
          />
        </div>
      </Section>

      <Section title="上传提示条" onReset={() => resetSection('howCopy')}>
        <div className="grid gap-2.5">
          <Field label="标题">
            <TextInput value={copy.uploadTitle} onChange={(v) => set('howCopy.uploadTitle', v)} />
          </Field>
          <Field label="说明">
            <TextArea value={copy.uploadBody} onChange={(v) => set('howCopy.uploadBody', v)} rows={2} />
          </Field>
          <Field label="链接文字">
            <TextInput value={copy.uploadLink} onChange={(v) => set('howCopy.uploadLink', v)} />
          </Field>
        </div>
      </Section>
    </div>
  )
}

/* ══════════════════════ 私聊 ══════════════════════ */

export function ChatEditor() {
  const { config, set, resetSection } = useConfig()
  const copy = config.chatCopy
  const story = config.chat[0]

  return (
    <div className="pt-1">
      <Section title="区块文案" defaultOpen onReset={() => resetSection('chatCopy')}>
        <div className="grid gap-2.5">
          <Field label="小标签">
            <TextInput value={copy.eyebrow} onChange={(v) => set('chatCopy.eyebrow', v)} />
          </Field>
          <Field label="标题">
            <TextArea value={copy.title} onChange={(v) => set('chatCopy.title', v)} rows={2} />
          </Field>
          <Field label="说明">
            <TextArea value={copy.sub} onChange={(v) => set('chatCopy.sub', v)} rows={2} />
          </Field>
          <Grid cols={2}>
            <Field label="阅后即焚角标">
              <TextInput value={copy.burnBadge} onChange={(v) => set('chatCopy.burnBadge', v)} />
            </Field>
            <Field label="发送按钮">
              <TextInput value={copy.sendLabel} onChange={(v) => set('chatCopy.sendLabel', v)} />
            </Field>
            <Field label="输入框占位" wide>
              <TextInput
                value={copy.inputPlaceholder}
                onChange={(v) => set('chatCopy.inputPlaceholder', v)}
              />
            </Field>
            <Field label="结尾留白" wide>
              <TextInput value={copy.endNote} onChange={(v) => set('chatCopy.endNote', v)} />
            </Field>
          </Grid>
        </div>
      </Section>

      <Section title="两个特点" onReset={() => resetSection('chatCopy')}>
        <div className="grid gap-2">
          {copy.features.map((f, i) => (
            <ItemCard
              key={`${f.title}-${i}`}
              index={i}
              title={f.title}
              canRemove={copy.features.length > 1}
              onRemove={() => set('chatCopy.features', copy.features.filter((_, j) => j !== i))}
            >
              <Field label="图标">
                <IconPicker
                  value={f.icon}
                  onChange={(v) => set(`chatCopy.features.${i}.icon`, v)}
                />
              </Field>
              <Field label="标题">
                <TextInput value={f.title} onChange={(v) => set(`chatCopy.features.${i}.title`, v)} />
              </Field>
              <Field label="说明">
                <TextArea
                  value={f.body}
                  onChange={(v) => set(`chatCopy.features.${i}.body`, v)}
                  rows={2}
                />
              </Field>
            </ItemCard>
          ))}
          <AddButton
            onClick={() =>
              set('chatCopy.features', [
                ...copy.features,
                { icon: 'shieldCheck', title: '新特点', body: '一句话说明。' },
              ])
            }
            label="添加特点"
          />
        </div>
      </Section>

      <Section title="聊天窗口" desc="逐条浮现的那段对话" defaultOpen onReset={() => resetSection('chat')}>
        <div className="grid gap-2.5">
          <Grid cols={2}>
            <Field label="对方名字">
              <TextInput
                value={story.name}
                onChange={(v) => set('chat.0.name', v)}
              />
            </Field>
            <Field label="距离与时间">
              <TextInput value={story.meta} onChange={(v) => set('chat.0.meta', v)} />
            </Field>
          </Grid>
          <Field label="头像 URL">
            <TextInput value={story.avatar} onChange={(v) => set('chat.0.avatar', v)} mono />
          </Field>
          {safeImageUrl(story.avatar) && (
            <img src={story.avatar} alt="" className="h-14 w-14 rounded-full object-cover" />
          )}
        </div>

        <div className="mt-3 grid gap-2">
          {story.lines.map((line, i) => (
            <ItemCard
              key={line.id}
              index={i}
              title={line.text}
              canRemove={story.lines.length > 1}
              onRemove={() =>
                set('chat.0.lines', story.lines.filter((l) => l.id !== line.id))
              }
            >
              <Field label="内容">
                <TextArea
                  value={line.text}
                  onChange={(v) => set(`chat.0.lines.${i}.text`, v)}
                  rows={2}
                />
              </Field>
              <Grid cols={2}>
                <Field label="谁发的">
                  <select
                    value={line.from}
                    onChange={(e) => set(`chat.0.lines.${i}.from`, e.target.value)}
                    className="w-full cursor-pointer rounded-lg border border-cream/10 bg-black/30 px-2.5 py-2 text-[12px] text-cream outline-none focus:border-copper/50"
                  >
                    <option value="her" className="bg-[#171719]">
                      对方（左）
                    </option>
                    <option value="you" className="bg-[#171719]">
                      我（右）
                    </option>
                  </select>
                </Field>
                <Field label="类型">
                  <Toggle
                    checked={Boolean(line.system)}
                    label={line.system ? '系统提示' : '普通气泡'}
                    onChange={(v) => set(`chat.0.lines.${i}.system`, v)}
                  />
                </Field>
              </Grid>
            </ItemCard>
          ))}
          <AddButton
            onClick={() =>
              set('chat.0.lines', [
                ...story.lines,
                { id: uid('line'), from: 'her', text: '新的一句话' },
              ])
            }
            label="添加一条消息"
          />
        </div>
      </Section>
    </div>
  )
}

/* ══════════════════════ 安装 ══════════════════════ */

export function InstallEditor() {
  const { config, set, resetSection } = useConfig()
  const copy = config.installCopy

  return (
    <div className="pt-1">
      <Section title="区块文案" defaultOpen onReset={() => resetSection('installCopy')}>
        <div className="grid gap-2.5">
          <Field label="小标签">
            <TextInput value={copy.eyebrow} onChange={(v) => set('installCopy.eyebrow', v)} />
          </Field>
          <Grid cols={2}>
            <Field label="标题前缀">
              <TextInput value={copy.title} onChange={(v) => set('installCopy.title', v)} />
            </Field>
            <Field label="渐变高亮">
              <TextInput
                value={copy.titleHighlight}
                onChange={(v) => set('installCopy.titleHighlight', v)}
              />
            </Field>
          </Grid>
          <Field label="说明">
            <TextArea value={copy.sub} onChange={(v) => set('installCopy.sub', v)} rows={3} />
          </Field>
        </div>
      </Section>

      <Section title="安装步骤" defaultOpen onReset={() => resetSection('installSteps')}>
        <div className="grid gap-2">
          {config.installSteps.map((s, i) => (
            <ItemCard
              key={s.id}
              index={i}
              title={s.title}
              canRemove={config.installSteps.length > 1}
              onRemove={() =>
                set('installSteps', config.installSteps.filter((x) => x.id !== s.id))
              }
            >
              <Field label="序号">
                <TextInput value={s.no} onChange={(v) => set(`installSteps.${i}.no`, v)} />
              </Field>
              <Field label="标题">
                <TextInput value={s.title} onChange={(v) => set(`installSteps.${i}.title`, v)} />
              </Field>
              <Field label="说明">
                <TextArea value={s.body} onChange={(v) => set(`installSteps.${i}.body`, v)} rows={2} />
              </Field>
            </ItemCard>
          ))}
          <AddButton
            onClick={() =>
              set('installSteps', [
                ...config.installSteps,
                { id: uid('step'), no: '04', title: '新步骤', body: '一句话说明。' },
              ])
            }
            label="添加步骤"
          />
        </div>
      </Section>

      <Section title="权限明细">
        <div className="grid gap-2">
          {copy.permissions.map((p, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 rounded-lg border border-cream/[0.08] p-2">
              <TextInput
                value={p.name}
                onChange={(v) => set(`installCopy.permissions.${i}.name`, v)}
                placeholder="权限名"
              />
              <div className="flex gap-1">
                <TextInput
                  value={p.why}
                  onChange={(v) => set(`installCopy.permissions.${i}.why`, v)}
                  placeholder="用途"
                />
                <button
                  type="button"
                  onClick={() =>
                    set(
                      'installCopy.permissions',
                      copy.permissions.filter((_, j) => j !== i),
                    )
                  }
                  className="shrink-0 rounded-md px-2 text-[11px] text-cream/25 transition hover:bg-red-500/15 hover:text-red-400"
                >
                  删
                </button>
              </div>
            </div>
          ))}
          <AddButton
            onClick={() =>
              set('installCopy.permissions', [
                ...copy.permissions,
                { name: '新权限', why: '用途说明' },
              ])
            }
            label="添加权限"
          />
        </div>
        <div className="mt-3 grid gap-2.5">
          <Field label="权限标题">
            <TextInput
              value={copy.permissionsTitle}
              onChange={(v) => set('installCopy.permissionsTitle', v)}
            />
          </Field>
          <Field label="权限补充说明">
            <TextArea
              value={copy.permissionsNote}
              onChange={(v) => set('installCopy.permissionsNote', v)}
              rows={2}
            />
          </Field>
        </div>
      </Section>

      <Section title="安全说明" onReset={() => resetSection('safety')}>
        <div className="grid gap-2">
          {config.safety.map((s, i) => (
            <ItemCard
              key={s.id}
              index={i}
              title={s.title}
              canRemove={config.safety.length > 1}
              onRemove={() => set('safety', config.safety.filter((x) => x.id !== s.id))}
            >
              <Field label="标题">
                <TextInput value={s.title} onChange={(v) => set(`safety.${i}.title`, v)} />
              </Field>
              <Field label="说明">
                <TextArea value={s.body} onChange={(v) => set(`safety.${i}.body`, v)} rows={2} />
              </Field>
            </ItemCard>
          ))}
          <AddButton
            onClick={() =>
              set('safety', [
                ...config.safety,
                { id: uid('sf'), title: '新说明', body: '一句话说明。' },
              ])
            }
            label="添加一条"
          />
        </div>
      </Section>

      <Section title="常见问题" onReset={() => resetSection('faqs')}>
        <div className="grid gap-2">
          {config.faqs.map((f, i) => (
            <ItemCard
              key={f.id}
              index={i}
              title={f.q}
              canRemove={config.faqs.length > 1}
              onRemove={() => set('faqs', config.faqs.filter((x) => x.id !== f.id))}
            >
              <Field label="问题">
                <TextInput value={f.q} onChange={(v) => set(`faqs.${i}.q`, v)} />
              </Field>
              <Field label="回答">
                <TextArea value={f.a} onChange={(v) => set(`faqs.${i}.a`, v)} rows={3} />
              </Field>
            </ItemCard>
          ))}
          <AddButton
            onClick={() =>
              set('faqs', [...config.faqs, { id: uid('faq'), q: '新问题？', a: '回答。' }])
            }
            label="添加问题"
          />
        </div>
      </Section>

      <Section title="其余文案">
        <div className="grid gap-2.5">
          <Grid cols={2}>
            <Field label="安全区小标签">
              <TextInput value={copy.safetyEyebrow} onChange={(v) => set('installCopy.safetyEyebrow', v)} />
            </Field>
            <Field label="安装包信息标题">
              <TextInput value={copy.apkTitle} onChange={(v) => set('installCopy.apkTitle', v)} />
            </Field>
            <Field label="直链备用文字">
              <TextInput value={copy.apkLink} onChange={(v) => set('installCopy.apkLink', v)} />
            </Field>
            <Field label="FAQ 标题">
              <TextInput value={copy.faqTitle} onChange={(v) => set('installCopy.faqTitle', v)} />
            </Field>
            <Field label="FAQ 提示">
              <TextInput value={copy.faqHint} onChange={(v) => set('installCopy.faqHint', v)} />
            </Field>
            <Field label="底部 CTA 标题">
              <TextInput value={copy.ctaTitle} onChange={(v) => set('installCopy.ctaTitle', v)} />
            </Field>
            <Field label="底部 CTA 说明" wide>
              <TextArea value={copy.ctaSub} onChange={(v) => set('installCopy.ctaSub', v)} rows={2} />
            </Field>
          </Grid>
          <Grid cols={3}>
            <Field label="协议">
              <TextInput value={copy.footLegal} onChange={(v) => set('installCopy.footLegal', v)} />
            </Field>
            <Field label="隐私">
              <TextInput value={copy.footPrivacy} onChange={(v) => set('installCopy.footPrivacy', v)} />
            </Field>
            <Field label="规范">
              <TextInput value={copy.footRules} onChange={(v) => set('installCopy.footRules', v)} />
            </Field>
          </Grid>
          <Field label="警告提示（三段）">
            <div className="grid gap-1.5">
              <TextInput value={copy.warningPrefix} onChange={(v) => set('installCopy.warningPrefix', v)} />
              <TextInput value={copy.warningStrong} onChange={(v) => set('installCopy.warningStrong', v)} />
              <TextArea
                value={copy.warningSuffix}
                onChange={(v) => set('installCopy.warningSuffix', v)}
                rows={2}
              />
            </div>
          </Field>
        </div>
      </Section>

      <Section title="下载弹窗" onReset={() => resetSection('modalCopy')}>
        <div className="grid gap-2.5">
          <Grid cols={2}>
            <Field label="弹窗标题">
              <TextInput value={config.modalCopy.title} onChange={(v) => set('modalCopy.title', v)} />
            </Field>
            <Field label="弹窗副标题">
              <TextInput value={config.modalCopy.sub} onChange={(v) => set('modalCopy.sub', v)} />
            </Field>
            <Field label="签名标题">
              <TextInput value={config.modalCopy.signTitle} onChange={(v) => set('modalCopy.signTitle', v)} />
            </Field>
            <Field label="安全扫描标题">
              <TextInput value={config.modalCopy.scanTitle} onChange={(v) => set('modalCopy.scanTitle', v)} />
            </Field>
          </Grid>
          <Field label="签名说明">
            <TextArea value={config.modalCopy.signBody} onChange={(v) => set('modalCopy.signBody', v)} rows={2} />
          </Field>
          <Field label="扫描说明">
            <TextArea value={config.modalCopy.scanBody} onChange={(v) => set('modalCopy.scanBody', v)} rows={2} />
          </Field>
          <Field label="未知来源标题">
            <TextInput
              value={config.modalCopy.unknownTitle}
              onChange={(v) => set('modalCopy.unknownTitle', v)}
            />
          </Field>
          <Field label="未知来源说明">
            <TextArea
              value={config.modalCopy.unknownBody}
              onChange={(v) => set('modalCopy.unknownBody', v)}
              rows={3}
            />
          </Field>
          <Field label="排错标题">
            <TextInput
              value={config.modalCopy.fixesTitle}
              onChange={(v) => set('modalCopy.fixesTitle', v)}
            />
          </Field>
          {config.modalCopy.fixes.map((f, i) => (
            <div key={i} className="grid gap-1.5 rounded-lg border border-cream/[0.08] p-2">
              <TextInput
                value={f.q}
                onChange={(v) => set(`modalCopy.fixes.${i}.q`, v)}
                placeholder="问题"
              />
              <div className="flex gap-1">
                <TextArea
                  value={f.a}
                  onChange={(v) => set(`modalCopy.fixes.${i}.a`, v)}
                  rows={2}
                />
                <button
                  type="button"
                  onClick={() =>
                    set('modalCopy.fixes', config.modalCopy.fixes.filter((_, j) => j !== i))
                  }
                  className="shrink-0 self-start rounded-md px-2 py-1 text-[11px] text-cream/25 transition hover:bg-red-500/15 hover:text-red-400"
                >
                  删
                </button>
              </div>
            </div>
          ))}
          <AddButton
            onClick={() =>
              set('modalCopy.fixes', [...config.modalCopy.fixes, { q: '新问题？', a: '解决办法。' }])
            }
            label="添加排错项"
          />
          <Field label="弹窗底部声明">
            <TextArea
              value={config.modalCopy.legal}
              onChange={(v) => set('modalCopy.legal', v)}
              rows={2}
            />
          </Field>
        </div>
      </Section>

      <Section title="拦截弹窗文案" desc="点手机内点赞/评论时弹出">
        <div className="grid gap-2">
          {(Object.keys(config.gates) as Array<keyof typeof config.gates>).map((key) => (
            <ItemCard
              key={key}
              index={0}
              title={`${
                { default: '默认', like: '点赞', comment: '评论', save: '收藏', share: '分享' }[
                  key as 'default'
                ] ?? key
              }`}
              onRemove={() => {}}
              canRemove={false}
            >
              <Field label="标题">
                <TextInput value={config.gates[key].title} onChange={(v) => set(`gates.${key}.title`, v)} />
              </Field>
              <Field label="说明">
                <TextArea value={config.gates[key].sub} onChange={(v) => set(`gates.${key}.sub`, v)} rows={2} />
              </Field>
              <Field label="按钮">
                <TextInput value={config.gates[key].cta} onChange={(v) => set(`gates.${key}.cta`, v)} />
              </Field>
            </ItemCard>
          ))}
        </div>
      </Section>

      <Section title="页脚" onReset={() => resetSection('footer')}>
        <div className="grid gap-2.5">
          <Field label="简介">
            <TextArea
              value={config.footer.about}
              onChange={(v) => set('footer.about', v)}
              rows={3}
            />
          </Field>
          <Field label="手机底栏小字">
            <TextInput value={config.footer.dockNote} onChange={(v) => set('footer.dockNote', v)} />
          </Field>
          {config.footer.groups.map((g, gi) => (
            <div key={g.id} className="rounded-lg border border-cream/[0.08] p-2.5">
              <TextInput
                value={g.title}
                onChange={(v) => set(`footer.groups.${gi}.title`, v)}
                placeholder="分组标题"
              />
              <div className="mt-2 grid gap-1.5">
                {g.items.map((item, ii) => (
                  <div key={item.id} className="grid grid-cols-2 gap-1.5">
                    <TextInput
                      value={item.label}
                      onChange={(v) => set(`footer.groups.${gi}.items.${ii}.label`, v)}
                    />
                    <div className="flex gap-1">
                      <TextInput
                        value={item.href}
                        onChange={(v) => set(`footer.groups.${gi}.items.${ii}.href`, v)}
                        mono
                      />
                      <button
                        type="button"
                        onClick={() =>
                          set(
                            `footer.groups.${gi}.items`,
                            g.items.filter((x) => x.id !== item.id),
                          )
                        }
                        className="shrink-0 rounded-md px-1.5 text-[10px] text-cream/25 hover:text-red-400"
                      >
                        删
                      </button>
                    </div>
                  </div>
                ))}
                <AddButton
                  onClick={() =>
                    set(`footer.groups.${gi}.items`, [
                      ...g.items,
                      { id: uid('lnk'), label: '新链接', href: '#' },
                    ])
                  }
                  label="添加链接"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

/* 视频编辑器已统一到 ./VideosSection.tsx
   首屏标签与「手机视频」标签共用同一份数据，不会出现两处内容对不上 */
