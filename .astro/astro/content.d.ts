declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"content": {
"notes/rip.md": {
	id: "notes/rip.md";
  slug: "notes/rip";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"notes/rsp.md": {
	id: "notes/rsp.md";
  slug: "notes/rsp";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"notes/stack.md": {
	id: "notes/stack.md";
  slug: "notes/stack";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"notes/syscalls.md": {
	id: "notes/syscalls.md";
  slug: "notes/syscalls";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"projects/minibank.md": {
	id: "projects/minibank.md";
  slug: "projects/minibank";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"projects/port-scanner.md": {
	id: "projects/port-scanner.md";
  slug: "projects/port-scanner";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"projects/simple2d.md": {
	id: "projects/simple2d.md";
  slug: "projects/simple2d";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"research/stack-overflow.md": {
	id: "research/stack-overflow.md";
  slug: "research/stack-overflow";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"tools/burp.md": {
	id: "tools/burp.md";
  slug: "tools/burp";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"tools/caido.md": {
	id: "tools/caido.md";
  slug: "tools/caido";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"tools/gdb.md": {
	id: "tools/gdb.md";
  slug: "tools/gdb";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"tools/ghidra.md": {
	id: "tools/ghidra.md";
  slug: "tools/ghidra";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"tools/metasploit.md": {
	id: "tools/metasploit.md";
  slug: "tools/metasploit";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"tools/nmap.md": {
	id: "tools/nmap.md";
  slug: "tools/nmap";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"tools/wireshark.md": {
	id: "tools/wireshark.md";
  slug: "tools/wireshark";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"writeups/ghost-lvl1.md": {
	id: "writeups/ghost-lvl1.md";
  slug: "writeups/ghost-lvl1";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"writeups/ghost-lvl10.md": {
	id: "writeups/ghost-lvl10.md";
  slug: "writeups/ghost-lvl10";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"writeups/ghost-lvl2.md": {
	id: "writeups/ghost-lvl2.md";
  slug: "writeups/ghost-lvl2";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"writeups/ghost-lvl3.md": {
	id: "writeups/ghost-lvl3.md";
  slug: "writeups/ghost-lvl3";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"writeups/ghost-lvl4.md": {
	id: "writeups/ghost-lvl4.md";
  slug: "writeups/ghost-lvl4";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"writeups/ghost-lvl5.md": {
	id: "writeups/ghost-lvl5.md";
  slug: "writeups/ghost-lvl5";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"writeups/ghost-lvl6.md": {
	id: "writeups/ghost-lvl6.md";
  slug: "writeups/ghost-lvl6";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"writeups/ghost-lvl7.md": {
	id: "writeups/ghost-lvl7.md";
  slug: "writeups/ghost-lvl7";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"writeups/ghost-lvl8.md": {
	id: "writeups/ghost-lvl8.md";
  slug: "writeups/ghost-lvl8";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
"writeups/ghost-lvl9.md": {
	id: "writeups/ghost-lvl9.md";
  slug: "writeups/ghost-lvl9";
  body: string;
  collection: "content";
  data: any
} & { render(): Render[".md"] };
};
"notes": {
"aslr.md": {
	id: "aslr.md";
  slug: "aslr";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"dep-nx.md": {
	id: "dep-nx.md";
  slug: "dep-nx";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"network-architecture.md": {
	id: "network-architecture.md";
  slug: "network-architecture";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"osi-model.md": {
	id: "osi-model.md";
  slug: "osi-model";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"rip.md": {
	id: "rip.md";
  slug: "rip";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"rsp.md": {
	id: "rsp.md";
  slug: "rsp";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
"stack-frames.md": {
	id: "stack-frames.md";
  slug: "stack-frames";
  body: string;
  collection: "notes";
  data: InferEntrySchema<"notes">
} & { render(): Render[".md"] };
};
"progress": Record<string, {
  id: string;
  slug: string;
  body: string;
  collection: "progress";
  data: InferEntrySchema<"progress">;
  render(): Render[".md"];
}>;
"projects": {
"minibank.md": {
	id: "minibank.md";
  slug: "minibank";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"port-scanner.md": {
	id: "port-scanner.md";
  slug: "port-scanner";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"simple2d.md": {
	id: "simple2d.md";
  slug: "simple2d";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
};
"research": {
"stack-overflow.md": {
	id: "stack-overflow.md";
  slug: "stack-overflow";
  body: string;
  collection: "research";
  data: InferEntrySchema<"research">
} & { render(): Render[".md"] };
};
"templates": {
"note.md": {
	id: "note.md";
  slug: "note";
  body: string;
  collection: "templates";
  data: any
} & { render(): Render[".md"] };
"project.md": {
	id: "project.md";
  slug: "project";
  body: string;
  collection: "templates";
  data: any
} & { render(): Render[".md"] };
"research.md": {
	id: "research.md";
  slug: "research";
  body: string;
  collection: "templates";
  data: any
} & { render(): Render[".md"] };
"tool.md": {
	id: "tool.md";
  slug: "tool";
  body: string;
  collection: "templates";
  data: any
} & { render(): Render[".md"] };
"writeup.md": {
	id: "writeup.md";
  slug: "writeup";
  body: string;
  collection: "templates";
  data: any
} & { render(): Render[".md"] };
};
"tools": {
"burp.md": {
	id: "burp.md";
  slug: "burp";
  body: string;
  collection: "tools";
  data: InferEntrySchema<"tools">
} & { render(): Render[".md"] };
"caido.md": {
	id: "caido.md";
  slug: "caido";
  body: string;
  collection: "tools";
  data: InferEntrySchema<"tools">
} & { render(): Render[".md"] };
"gdb.md": {
	id: "gdb.md";
  slug: "gdb";
  body: string;
  collection: "tools";
  data: InferEntrySchema<"tools">
} & { render(): Render[".md"] };
"ghidra.md": {
	id: "ghidra.md";
  slug: "ghidra";
  body: string;
  collection: "tools";
  data: InferEntrySchema<"tools">
} & { render(): Render[".md"] };
"metasploit.md": {
	id: "metasploit.md";
  slug: "metasploit";
  body: string;
  collection: "tools";
  data: InferEntrySchema<"tools">
} & { render(): Render[".md"] };
"nmap.md": {
	id: "nmap.md";
  slug: "nmap";
  body: string;
  collection: "tools";
  data: InferEntrySchema<"tools">
} & { render(): Render[".md"] };
"wireshark.md": {
	id: "wireshark.md";
  slug: "wireshark";
  body: string;
  collection: "tools";
  data: InferEntrySchema<"tools">
} & { render(): Render[".md"] };
};
"writeups": {
"ghost-lvl1.md": {
	id: "ghost-lvl1.md";
  slug: "ghost-lvl1";
  body: string;
  collection: "writeups";
  data: InferEntrySchema<"writeups">
} & { render(): Render[".md"] };
"ghost-lvl10.md": {
	id: "ghost-lvl10.md";
  slug: "ghost-lvl10";
  body: string;
  collection: "writeups";
  data: InferEntrySchema<"writeups">
} & { render(): Render[".md"] };
"ghost-lvl2.md": {
	id: "ghost-lvl2.md";
  slug: "ghost-lvl2";
  body: string;
  collection: "writeups";
  data: InferEntrySchema<"writeups">
} & { render(): Render[".md"] };
"ghost-lvl3.md": {
	id: "ghost-lvl3.md";
  slug: "ghost-lvl3";
  body: string;
  collection: "writeups";
  data: InferEntrySchema<"writeups">
} & { render(): Render[".md"] };
"ghost-lvl4.md": {
	id: "ghost-lvl4.md";
  slug: "ghost-lvl4";
  body: string;
  collection: "writeups";
  data: InferEntrySchema<"writeups">
} & { render(): Render[".md"] };
"ghost-lvl5.md": {
	id: "ghost-lvl5.md";
  slug: "ghost-lvl5";
  body: string;
  collection: "writeups";
  data: InferEntrySchema<"writeups">
} & { render(): Render[".md"] };
"ghost-lvl6.md": {
	id: "ghost-lvl6.md";
  slug: "ghost-lvl6";
  body: string;
  collection: "writeups";
  data: InferEntrySchema<"writeups">
} & { render(): Render[".md"] };
"ghost-lvl7.md": {
	id: "ghost-lvl7.md";
  slug: "ghost-lvl7";
  body: string;
  collection: "writeups";
  data: InferEntrySchema<"writeups">
} & { render(): Render[".md"] };
"ghost-lvl8.md": {
	id: "ghost-lvl8.md";
  slug: "ghost-lvl8";
  body: string;
  collection: "writeups";
  data: InferEntrySchema<"writeups">
} & { render(): Render[".md"] };
"ghost-lvl9.md": {
	id: "ghost-lvl9.md";
  slug: "ghost-lvl9";
  body: string;
  collection: "writeups";
  data: InferEntrySchema<"writeups">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
