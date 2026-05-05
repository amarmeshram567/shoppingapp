import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  AdminPage,
  Button,
  EmptyState,
  Field,
  Modal,
  StatusBadge,
  Surface,
  TextArea,
  TextInput
} from "../../components/AdminUi";
import { adminMockData } from "../../lib/adminMockData";

const createBlockDraft = (block) => ({
  id: block?.id || "",
  name: block?.name || "",
  status: block?.status || "Draft",
  updatedAt: block?.updatedAt || new Date().toISOString().slice(0, 10),
  headline: block?.headline || "",
  content: block?.content || ""
});

const CmsPage = () => {
  const [blocks, setBlocks] = useState(
    adminMockData.cmsBlocks.map((block) => ({
      ...block,
      headline: block.headline || `${block.name} headline`,
      content: block.content || "Add storefront content, campaign details, or merchandising guidance."
    }))
  );
  const [heroTitle, setHeroTitle] = useState("Curated pieces for elevated living");
  const [promoCopy, setPromoCopy] = useState("Free delivery on premium orders over $500 this week.");
  const [heroImageName, setHeroImageName] = useState("No file selected");
  const [editorOpen, setEditorOpen] = useState(false);
  const [draftBlock, setDraftBlock] = useState(createBlockDraft());
  const [activeBlockId, setActiveBlockId] = useState(adminMockData.cmsBlocks[0]?.id || "");

  const activeBlock = useMemo(
    () => blocks.find((block) => block.id === activeBlockId) || blocks[0] || null,
    [activeBlockId, blocks]
  );

  const openEditor = (block) => {
    setDraftBlock(createBlockDraft(block));
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setDraftBlock(createBlockDraft());
  };

  const handleSaveBlock = () => {
    const normalizedName = draftBlock.name.trim();
    const normalizedHeadline = draftBlock.headline.trim();
    const normalizedContent = draftBlock.content.trim();

    if (!normalizedName || !normalizedHeadline || !normalizedContent) {
      toast.error("Complete the block name, headline, and content.");
      return;
    }

    const savedBlock = {
      ...draftBlock,
      id: draftBlock.id || crypto.randomUUID(),
      name: normalizedName,
      headline: normalizedHeadline,
      content: normalizedContent,
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    setBlocks((current) => {
      const exists = current.some((block) => block.id === savedBlock.id);
      return exists
        ? current.map((block) => (block.id === savedBlock.id ? savedBlock : block))
        : [savedBlock, ...current];
    });
    setActiveBlockId(savedBlock.id);
    closeEditor();
    toast.success(draftBlock.id ? "Content block updated" : "Content block created");
  };

  return (
    <AdminPage
      eyebrow="Content operations"
      title="CMS and banner management"
      description="Manage homepage hero banners, promo strips, and landing page blocks with enterprise-safe editing controls."
      actions={
        <Button onClick={() => openEditor(null)}>
          <Plus className="h-4 w-4" />
          Add block
        </Button>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <Surface className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Homepage hero banner</h3>
              <p className="mt-2 text-sm text-slate-400">Update the storefront headline, promo message, and hero visual.</p>
            </div>
            <StatusBadge value="Published" />
          </div>
          <div className="mt-5 grid gap-5">
            <Field label="Hero title">
              <TextInput value={heroTitle} onChange={(event) => setHeroTitle(event.target.value)} placeholder="Enter homepage headline" />
            </Field>
            <Field label="Promo copy">
              <TextArea value={promoCopy} onChange={(event) => setPromoCopy(event.target.value)} placeholder="Highlight your main offer or campaign" />
            </Field>
            <Field label="Hero image">
              <div className="space-y-3">
                <TextInput
                  type="file"
                  accept="image/*"
                  onChange={(event) => setHeroImageName(event.target.files?.[0]?.name || "No file selected")}
                />
                <p className="text-xs text-slate-500">Selected asset: {heroImageName}</p>
              </div>
            </Field>
            <div className="flex justify-end">
              <Button onClick={() => toast.success("Hero content saved")}>Save hero content</Button>
            </div>
          </div>
        </Surface>

        <Surface className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Landing page blocks</h3>
              <p className="mt-2 text-sm text-slate-400">Edit campaign modules, supporting copy, and publishing status.</p>
            </div>
            <StatusBadge value={`${blocks.length} blocks`} />
          </div>

          {blocks.length ? (
            <div className="mt-4 space-y-3">
              {blocks.map((block) => (
                <button
                  key={block.id}
                  type="button"
                  onClick={() => setActiveBlockId(block.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    activeBlock?.id === block.id
                      ? "border-primary/40 bg-primary/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{block.name}</p>
                      <p className="mt-1 text-xs text-slate-500">Updated {block.updatedAt}</p>
                    </div>
                    <StatusBadge value={block.status} />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                title="No content blocks yet"
                description="Create your first CMS block to populate landing pages and promotional surfaces."
                action={<Button onClick={() => openEditor(null)}>Create block</Button>}
              />
            </div>
          )}
        </Surface>
      </div>

      {activeBlock ? (
        <Surface className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Selected block</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{activeBlock.name}</h3>
              <p className="mt-2 max-w-3xl text-sm text-slate-400">{activeBlock.content}</p>
            </div>
            <div className="flex gap-3">
              <Button tone="secondary" onClick={() => openEditor(activeBlock)}>
                Edit block
              </Button>
              <Button
                tone="danger"
                onClick={() => {
                  setBlocks((current) => current.filter((block) => block.id !== activeBlock.id));
                  setActiveBlockId((current) => (current === activeBlock.id ? "" : current));
                  toast.success("Content block removed");
                }}
              >
                Delete block
              </Button>
            </div>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Headline</p>
              <p className="mt-3 text-lg font-medium text-white">{activeBlock.headline}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Publishing</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <StatusBadge value={activeBlock.status} />
                <span className="text-sm text-slate-400">Updated {activeBlock.updatedAt}</span>
              </div>
            </div>
          </div>
        </Surface>
      ) : null}

      <Modal
        open={editorOpen}
        title={draftBlock.id ? "Edit content block" : "Create content block"}
        description="Set the module title, storefront message, and publication state."
        onClose={closeEditor}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Block name">
            <TextInput
              value={draftBlock.name}
              onChange={(event) => setDraftBlock((current) => ({ ...current, name: event.target.value }))}
              placeholder="Hero banner"
            />
          </Field>
          <Field label="Status">
            <select
              value={draftBlock.status}
              onChange={(event) => setDraftBlock((current) => ({ ...current, status: event.target.value }))}
              className="w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/60"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Headline">
              <TextInput
                value={draftBlock.headline}
                onChange={(event) => setDraftBlock((current) => ({ ...current, headline: event.target.value }))}
                placeholder="Block headline"
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Content">
              <TextArea
                value={draftBlock.content}
                onChange={(event) => setDraftBlock((current) => ({ ...current, content: event.target.value }))}
                placeholder="Describe the campaign or landing page content"
              />
            </Field>
          </div>
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button tone="secondary" onClick={closeEditor}>
              Cancel
            </Button>
            <Button onClick={handleSaveBlock}>
              {draftBlock.id ? "Save changes" : "Create block"}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminPage>
  );
};

export default CmsPage;
