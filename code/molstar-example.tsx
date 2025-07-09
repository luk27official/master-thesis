/**
 * Sets the transparency of a structure in the Mol* plugin.
 * @param plugin Mol* plugin instance
 * @param alpha Transparency value (0-1)
 * @param representations Array of representations
 * @param structure Structure object (Mol*)
 */
export const setStructureTransparency = async (plugin: PluginUIContext, alpha: number, representations: RepresentationWithRef<PocketRepresentationType | PolymerRepresentationType>[], structure: StateObjectSelector) => {
    type TransparencyParams = {
        bundle: Bundle;
        value: number;
    };

    const params: TransparencyParams[] = [];

    const query = MS.struct.generator.all;
    const sel = Script.getStructureSelection(query, structure.cell!.obj!.data);
    const bundle = Bundle.fromSelection(sel);

    params.push({
        bundle: bundle,
        value: 1 - alpha
    });

    for (const element of representations) {
        const builder = plugin.state.data.build();
        if (element.transparentObjectRef) {
            builder.to(element.object.ref).delete(element.transparentObjectRef);
        }
        await builder.commit();

        const r = await plugin.state.data.build().to(element.object.ref).apply(StateTransforms.Representation
            .TransparencyStructureRepresentation3DFromBundle, { layers: params }).commit();
        element.transparentObjectRef = r.ref;
    }
};